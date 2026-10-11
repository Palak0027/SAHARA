const adminRepository = require('../repository/admin.repository');
const AppError = require('../utils/AppError');
const User = require('../models/User');

class AdminService {
  async getDashboardStats() {
    return await adminRepository.getPlatformStats();
  }

  async getAllUsers(queryParams) {
    return await adminRepository.getUsers(queryParams);
  }

  async toggleUserStatus(adminUserId, targetUserId, isActive) {
    if (adminUserId.toString() === targetUserId.toString()) {
      throw new AppError('Admin cannot deactivate their own account', 400);
    }

    const updatedUser = await adminRepository.updateUserStatus(targetUserId, isActive);
    if (!updatedUser) {
      throw new AppError('User not found', 404);
    }
    return updatedUser;
  }

  async updateUserRole(targetUserId, roleData) {
    const updatedUser = await adminRepository.updateUserRole(targetUserId, roleData);
    if (!updatedUser) {
      throw new AppError('User not found', 404);
    }
    return updatedUser;
  }

  async getUserDetails(targetUserId) {
    const details = await adminRepository.getUserById(targetUserId);
    if (!details) {
      throw new AppError('User not found', 404);
    }
    return details;
  }

  async getPendingVerifications(queryParams) {
    return await adminRepository.getVerifications(queryParams);
  }

  async updateVerification(userId, { status, rejectionReason }) {
    if (!['verified', 'rejected', 'pending'].includes(status)) {
      throw new AppError('Invalid verification status', 400);
    }

    const updated = await adminRepository.updateVerificationStatus(userId, {
      status,
      rejectionReason
    });

    if (!updated) {
      throw new AppError('Organization not found', 404);
    }
    return updated;
  }

  async getAllDonations(queryParams) {
    return await adminRepository.getDonations(queryParams);
  }

  async updateDonationStatus(donationId, status) {
    const validStatuses = ['available', 'matched', 'accepted', 'in_transit', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new AppError('Invalid donation status', 400);
    }

    const updated = await adminRepository.updateDonationStatus(donationId, status);
    if (!updated) {
      throw new AppError('Donation not found', 404);
    }
    return updated;
  }

  async getAllNeeds(queryParams) {
    return await adminRepository.getNeeds(queryParams);
  }

  async updateNeedStatus(needId, status) {
    const validStatuses = ['open', 'matched', 'accepted', 'in_transit', 'fulfilled', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new AppError('Invalid need status', 400);
    }

    const updated = await adminRepository.updateNeedStatus(needId, status);
    if (!updated) {
      throw new AppError('Need request not found', 404);
    }
    return updated;
  }

  async getVolunteers() {
    return await adminRepository.getVolunteers();
  }

  async dispatchTask(adminId, taskData) {
    const { title } = taskData;
    if (!title) {
      throw new AppError('Task title is required', 400);
    }

    return await adminRepository.createDispatchTask({
      ...taskData,
      adminId
    });
  }

  async getAllTasks(queryParams) {
    return await adminRepository.getTasks(queryParams);
  }

  async createVolunteer(volunteerData) {
    const { name, phone, email, password, location, vehicleType, availability } = volunteerData;

    if (!name || name.trim().length < 2) {
      throw new AppError('Full name is required (at least 2 characters)', 400);
    }

    const cleanPhone = phone?.trim();
    if (!cleanPhone || !/^[0-9]{10}$/.test(cleanPhone)) {
      throw new AppError('Please provide a valid 10-digit mobile number', 400);
    }

    if (!password || password.length < 6) {
      throw new AppError('Password must be at least 6 characters long', 400);
    }

    // Check duplicate phone
    const existingPhone = await User.findOne({ phone: cleanPhone });
    if (existingPhone) {
      throw new AppError('A user with this phone number already exists', 409);
    }

    // Check duplicate email if provided
    if (email && email.trim()) {
      const cleanEmail = email.trim().toLowerCase();
      const existingEmail = await User.findOne({ email: cleanEmail });
      if (existingEmail) {
        throw new AppError('A user with this email address already exists', 409);
      }
    }

    return await adminRepository.createVolunteer({
      name: name.trim(),
      phone: cleanPhone,
      email: email ? email.trim() : undefined,
      password,
      location: location || {},
      volunteerDetails: {
        vehicleType: vehicleType || 'two_wheeler',
        availability: availability !== undefined ? availability : true
      }
    });
  }
}

module.exports = new AdminService();
