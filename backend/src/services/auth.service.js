const bcrypt = require('bcrypt');
const userRepository = require('../repository/user.repository');
const generateToken = require('../utils/generateToken');
const AppError = require('../utils/AppError');

/**
 * Format user entity into safe API response payload
 */
const formatUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  phone: user.phone,
  email: user.email,
  role: user.role,
  roles: user.roles && user.roles.length > 0 ? user.roles : [user.role],
  activeRole: user.activeRole || user.role,
  receiverType: user.receiverType,
  location: user.location,
  organization: user.organization,
  onBehalfOf: user.onBehalfOf,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

/**
 * AuthService - Handles all authentication and role-switching business logic
 */
class AuthService {
  /**
   * Register a new user (Donor or Receiver)
   * @param {object} registrationData
   * @returns {Promise<{token: string, user: object}>}
   */
  async register(registrationData) {
    const {
      intent,
      name,
      phone,
      email,
      password,
      location,
      receiverType,
      onBehalfOf,
      organization
    } = registrationData;

    // 1. Strict Role Guard: Only 'donor' and 'receiver' can be registered publicly
    if (!['donor', 'receiver'].includes(intent)) {
      throw new AppError('Public registration is only allowed for Donor and Receiver roles.', 403);
    }

    const cleanPhone = phone?.trim();
    const cleanEmail = email && email.trim() ? email.toLowerCase().trim() : undefined;

    // 2. Check for duplicate phone
    const existingPhone = await userRepository.findByPhone(cleanPhone);
    if (existingPhone) {
      throw new AppError('Already registered ', 409);
    }

    // 3. Check for duplicate email (if provided)
    if (cleanEmail) {
      const existingEmail = await userRepository.findByEmail(cleanEmail);
      if (existingEmail) {
        throw new AppError('A user with this email address is already registered.', 409);
      }
    }

    // 4. Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 5. Construct User Document according to role & intent
    const userData = {
      name: name?.trim(),
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
          lat: location?.coordinates?.lat ?? null,
          lng: location?.coordinates?.lng ?? null
        }
      }
    };

    // If intent is receiver, configure receiver-specific metadata
    if (intent === 'receiver') {
      userData.receiverType = receiverType || 'individual';

      if (onBehalfOf && onBehalfOf.isOnBehalf) {
        userData.onBehalfOf = {
          isOnBehalf: true,
          beneficiaryName: onBehalfOf.beneficiaryName?.trim() || '',
          beneficiaryAge: Number(onBehalfOf.beneficiaryAge) || null,
          relationship: onBehalfOf.relationship?.trim() || '',
          beneficiaryLocation: onBehalfOf.beneficiaryLocation?.trim() || ''
        };
      }

      if (userData.receiverType === 'organization') {
        userData.organization = {
          orgName: organization?.orgName?.trim() || '',
          regNumber: organization?.regNumber?.trim() || '',
          description: organization?.description?.trim() || '',
          verificationStatus: 'pending' // Default state for admin review
        };
      }
    }

    // 6. Save to database via repository
    const newUser = await userRepository.create(userData);

    // 7. Generate JWT token
    const token = generateToken(newUser._id, newUser.role, newUser.roles, newUser.activeRole);

    return {
      token,
      user: formatUserResponse(newUser)
    };
  }

  /**
   * Login existing user with email or phone + password
   * @param {string} identifier - Phone or email
   * @param {string} password - Raw password
   * @returns {Promise<{token: string, user: object}>}
   */
  async login(identifier, password) {
    if (!identifier || !password) {
      throw new AppError('Please provide both identifier and password.', 400);
    }

    // Query user by phone or email including hidden passwordHash
    const user = await userRepository.findByIdentifierWithPassword(identifier);

    if (!user) {
      throw new AppError('Invalid credentials. Please verify your phone/email and password.', 401);
    }

    // Check account status
    if (!user.isActive) {
      throw new AppError('Your account has been deactivated. Please contact support.', 403);
    }

    // Verify password with bcrypt
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid credentials. Please verify your phone/email and password.', 401);
    }

    // Ensure roles array has at least the primary role
    const roles = user.roles && user.roles.length > 0 ? user.roles : [user.role];
    const activeRole = user.activeRole || user.role;

    // Generate JWT token
    const token = generateToken(user._id, user.role, roles, activeRole);

    return {
      token,
      user: formatUserResponse(user)
    };
  }

  /**
   * Switch active mode or unlock new role (Dual-role capability)
   * @param {string} userId - Current user ID from token
   * @param {object} payload - { targetRole, receiverType, onBehalfOf, organization }
   * @returns {Promise<{token: string, user: object, targetRole: string}>}
   */
  async switchRole(userId, payload) {
    const { targetRole, receiverType, onBehalfOf, organization } = payload;

    if (!targetRole || !['donor', 'receiver'].includes(targetRole)) {
      throw new AppError("Target role must be either 'donor' or 'receiver'.", 400);
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found.', 404);
    }

    // Add targetRole to roles array if not already present
    if (!user.roles.includes(targetRole)) {
      user.roles.push(targetRole);
    }

    // Update activeRole and primary role
    user.activeRole = targetRole;
    user.role = targetRole;

    // If switching to receiver mode, optionally set receiver-specific details
    if (targetRole === 'receiver') {
      if (receiverType) user.receiverType = receiverType;

      if (onBehalfOf && onBehalfOf.isOnBehalf) {
        user.onBehalfOf = {
          isOnBehalf: true,
          beneficiaryName: onBehalfOf.beneficiaryName?.trim() || '',
          beneficiaryAge: Number(onBehalfOf.beneficiaryAge) || null,
          relationship: onBehalfOf.relationship?.trim() || '',
          beneficiaryLocation: onBehalfOf.beneficiaryLocation?.trim() || ''
        };
      }

      if (receiverType === 'organization' && organization?.orgName) {
        user.organization = {
          orgName: organization.orgName.trim(),
          regNumber: organization.regNumber?.trim() || '',
          description: organization.description?.trim() || '',
          verificationStatus: user.organization?.verificationStatus || 'pending'
        };
      }
    }

    await userRepository.save(user);

    // Generate fresh JWT token with updated activeRole & roles
    const token = generateToken(user._id, user.role, user.roles, user.activeRole);

    return {
      token,
      user: formatUserResponse(user),
      targetRole
    };
  }

  /**
   * Get user profile by ID
   * @param {string} userId
   * @returns {Promise<object>}
   */
  async getProfile(userId) {
    const user = await userRepository.findById(userId, '-passwordHash');
    if (!user) {
      throw new AppError('User not found.', 404);
    }
    return user;
  }
}

module.exports = new AuthService();
