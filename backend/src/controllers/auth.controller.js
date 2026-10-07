const bcrypt = require('bcrypt');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 *
 * Public registration is allowed for:
 * Donor, Receiver, Volunteer
 *
 * Admin registration is NOT allowed.
 */
const register = async (req, res, next) => {
  try {
    const {
      intent,
      name,
      phone,
      email,
      password,
      location,
      receiverType,
      onBehalfOf,
      organization,
    } = req.body;

    // --------------------------------------------------
    // 1. Strict public registration role guard
    // --------------------------------------------------
    if (!['donor', 'receiver', 'volunteer'].includes(intent)) {
      return res.status(403).json({
        success: false,
        message:
          'Public registration is only allowed for Donor, Receiver, and Volunteer roles.',
      });
    }

    // --------------------------------------------------
    // 2. Clean input
    // --------------------------------------------------
    const cleanPhone = phone.trim();

    const cleanEmail =
      email && email.trim()
        ? email.toLowerCase().trim()
        : undefined;

    // --------------------------------------------------
    // 3. Check duplicate phone
    // --------------------------------------------------
    const existingPhone = await User.findOne({
      phone: cleanPhone,
    });

    if (existingPhone) {
      return res.status(409).json({
        success: false,
        message:
          'A user with this phone number is already registered.',
      });
    }

    // --------------------------------------------------
    // 4. Check duplicate email
    // --------------------------------------------------
    if (cleanEmail) {
      const existingEmail = await User.findOne({
        email: cleanEmail,
      });

      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message:
            'A user with this email address is already registered.',
        });
      }
    }

    // --------------------------------------------------
    // 5. Hash password
    // --------------------------------------------------
    const saltRounds = 10;

    const passwordHash = await bcrypt.hash(
      password,
      saltRounds
    );

    // --------------------------------------------------
    // 6. Construct base user document
    // --------------------------------------------------
    const userData = {
      name: name.trim(),

      phone: cleanPhone,

      email: cleanEmail,

      passwordHash,

      role: intent,

      roles: [intent],

      activeRole: intent,

      location: {
        address: location?.address?.trim() || '',
        city: location?.city?.trim() || '',
        state: location?.state?.trim() || '',
        pincode: location?.pincode?.trim() || '',

        coordinates: {
          lat: location?.coordinates?.lat || null,
          lng: location?.coordinates?.lng || null,
        },
      },

      isActive: true,
    };

    // --------------------------------------------------
    // 7. Receiver-specific information
    // --------------------------------------------------
    if (intent === 'receiver') {
      userData.receiverType =
        receiverType || 'individual';

      if (
        onBehalfOf &&
        onBehalfOf.isOnBehalf
      ) {
        userData.onBehalfOf = {
          isOnBehalf: true,

          beneficiaryName:
            onBehalfOf.beneficiaryName?.trim() || '',

          beneficiaryAge:
            Number(onBehalfOf.beneficiaryAge) || null,

          relationship:
            onBehalfOf.relationship?.trim() || '',

          beneficiaryLocation:
            onBehalfOf.beneficiaryLocation?.trim() || '',
        };
      }

      if (
        userData.receiverType ===
        'organization'
      ) {
        userData.organization = {
          orgName:
            organization?.orgName?.trim() || '',

          regNumber:
            organization?.regNumber?.trim() || '',

          description:
            organization?.description?.trim() || '',

          verificationStatus: 'pending',
        };
      }
    }

    // --------------------------------------------------
    // 8. Volunteer-specific information
    // --------------------------------------------------
    if (intent === 'volunteer') {
      userData.volunteerDetails = {
        availability: true,
        vehicleType: 'two_wheeler',
      };
    }

    // --------------------------------------------------
    // 9. Save user
    // --------------------------------------------------
    const newUser = await User.create(userData);

    // --------------------------------------------------
    // 10. Generate JWT
    // --------------------------------------------------
    const token = generateToken(
      newUser._id,
      newUser.role,
      newUser.roles,
      newUser.activeRole
    );

    // --------------------------------------------------
    // 11. Return response
    // --------------------------------------------------
    return res.status(201).json({
      success: true,

      message: 'Registration successful',

      token,

      user: {
        id: newUser._id,

        name: newUser.name,

        phone: newUser.phone,

        email: newUser.email,

        role: newUser.role,

        roles: newUser.roles,

        activeRole: newUser.activeRole,

        receiverType:
          newUser.receiverType,

        location:
          newUser.location,

        organization:
          newUser.organization,

        onBehalfOf:
          newUser.onBehalfOf,

        volunteerDetails:
          newUser.volunteerDetails,

        createdAt:
          newUser.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login existing user with email or phone + password
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const {
      identifier,
      password,
    } = req.body;

    const cleanIdentifier =
      identifier.trim();

    const isEmail =
      cleanIdentifier.includes('@');

    // --------------------------------------------------
    // Find user
    // --------------------------------------------------
    const query = isEmail
      ? {
          email:
            cleanIdentifier
              .toLowerCase(),
        }
      : {
          phone: cleanIdentifier,
        };

    // passwordHash is hidden by default,
    // so explicitly include it.
    const user =
      await User.findOne(query)
        .select('+passwordHash');

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          'Invalid credentials. Please verify your phone/email and password.',
      });
    }

    // --------------------------------------------------
    // Check account status
    // --------------------------------------------------
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message:
          'Your account has been deactivated. Please contact support.',
      });
    }

    // --------------------------------------------------
    // Check password
    // --------------------------------------------------
    const isMatch =
      await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message:
          'Invalid credentials. Please verify your phone/email and password.',
      });
    }

    // --------------------------------------------------
    // Roles
    // --------------------------------------------------
    const roles =
      user.roles &&
      user.roles.length > 0
        ? user.roles
        : [user.role];

    const activeRole =
      user.activeRole ||
      user.role;

    // --------------------------------------------------
    // Generate JWT
    // --------------------------------------------------
    const token =
      generateToken(
        user._id,
        user.role,
        roles,
        activeRole
      );

    // --------------------------------------------------
    // Return response
    // --------------------------------------------------
    return res.status(200).json({
      success: true,

      message: 'Login successful',

      token,

      user: {
        id: user._id,

        name: user.name,

        phone: user.phone,

        email: user.email,

        role: user.role,

        roles,

        activeRole,

        receiverType:
          user.receiverType,

        location:
          user.location,

        organization:
          user.organization,

        onBehalfOf:
          user.onBehalfOf,

        volunteerDetails:
          user.volunteerDetails,

        createdAt:
          user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Switch active mode
 * @route   PUT /api/auth/switch-role
 * @access  Private
 *
 * Only Donor <-> Receiver switching is allowed.
 * Volunteer/Admin cannot be unlocked through this endpoint.
 */
const switchRole = async (
  req,
  res,
  next
) => {
  try {
    const {
      targetRole,
      receiverType,
      onBehalfOf,
      organization,
    } = req.body;

    if (
      !targetRole ||
      !['donor', 'receiver'].includes(
        targetRole
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Target role must be either 'donor' or 'receiver'.",
      });
    }

    const user =
      await User.findById(
        req.user._id
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Add role if not already present
    if (
      !user.roles.includes(targetRole)
    ) {
      user.roles.push(targetRole);
    }

    user.activeRole =
      targetRole;

    user.role =
      targetRole;

    // Receiver-specific details
    if (
      targetRole === 'receiver'
    ) {
      if (receiverType) {
        user.receiverType =
          receiverType;
      }

      if (
        onBehalfOf &&
        onBehalfOf.isOnBehalf
      ) {
        user.onBehalfOf = {
          isOnBehalf: true,

          beneficiaryName:
            onBehalfOf.beneficiaryName?.trim() ||
            '',

          beneficiaryAge:
            Number(
              onBehalfOf.beneficiaryAge
            ) || null,

          relationship:
            onBehalfOf.relationship?.trim() ||
            '',

          beneficiaryLocation:
            onBehalfOf.beneficiaryLocation?.trim() ||
            '',
        };
      }

      if (
        receiverType ===
          'organization' &&
        organization?.orgName
      ) {
        user.organization = {
          orgName:
            organization.orgName.trim(),

          regNumber:
            organization.regNumber?.trim() ||
            '',

          description:
            organization.description?.trim() ||
            '',

          verificationStatus:
            user.organization
              ?.verificationStatus ||
            'pending',
        };
      }
    }

    await user.save();

    const token =
      generateToken(
        user._id,
        user.role,
        user.roles,
        user.activeRole
      );

    return res.status(200).json({
      success: true,

      message:
        `Switched to ${targetRole} mode successfully`,

      token,

      user: {
        id: user._id,

        name: user.name,

        phone: user.phone,

        email: user.email,

        role: user.role,

        roles: user.roles,

        activeRole:
          user.activeRole,

        receiverType:
          user.receiverType,

        location:
          user.location,

        organization:
          user.organization,

        onBehalfOf:
          user.onBehalfOf,

        volunteerDetails:
          user.volunteerDetails,

        updatedAt:
          user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get profile of logged-in user
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getProfile = async (
  req,
  res
) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};

module.exports = {
  register,
  login,
  switchRole,
  getProfile,
  getMe: getProfile,
};