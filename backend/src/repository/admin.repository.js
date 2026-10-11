const User = require('../models/User');
const Donation = require('../models/Donation');
const Need = require('../models/Need');
const Category = require('../models/Category');
const Task = require('../models/Task');
const bcrypt = require('bcrypt');

class AdminRepository {
  async getPlatformStats() {
    const [
      totalUsers,
      donorCount,
      receiverCount,
      volunteerCount,
      activeUsers,
      blockedUsers,
      totalDonations,
      availableDonations,
      completedDonations,
      totalNeeds,
      openNeeds,
      criticalNeeds,
      fulfilledNeeds,
      pendingVerifications,
      activeVolunteers,
      totalTasks
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'donor' }),
      User.countDocuments({ role: 'receiver' }),
      User.countDocuments({ role: 'volunteer' }),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ isActive: false }),
      Donation.countDocuments(),
      Donation.countDocuments({ status: 'available' }),
      Donation.countDocuments({ status: 'completed' }),
      Need.countDocuments(),
      Need.countDocuments({ status: 'open' }),
      Need.countDocuments({ urgency: 'critical', status: { $ne: 'fulfilled' } }),
      Need.countDocuments({ status: 'fulfilled' }),
      User.countDocuments({
        receiverType: 'organization',
        'organization.verificationStatus': 'pending'
      }),
      User.countDocuments({
        role: 'volunteer',
        isActive: true,
        'volunteerDetails.availability': true
      }),
      Task.countDocuments()
    ]);

    // Fetch recent items for dashboard activity stream
    const [recentUsers, recentDonations, recentNeeds] = await Promise.all([
      User.find().sort({ createdAt: -1 }).limit(5).select('name phone email role isActive createdAt'),
      Donation.find().populate('donorId', 'name phone').sort({ createdAt: -1 }).limit(5),
      Need.find().populate('receiverId', 'name phone').sort({ createdAt: -1 }).limit(5)
    ]);

    return {
      users: {
        total: totalUsers,
        donors: donorCount,
        receivers: receiverCount,
        volunteers: volunteerCount,
        active: activeUsers,
        blocked: blockedUsers
      },
      donations: {
        total: totalDonations,
        available: availableDonations,
        completed: completedDonations
      },
      needs: {
        total: totalNeeds,
        open: openNeeds,
        critical: criticalNeeds,
        fulfilled: fulfilledNeeds
      },
      verifications: {
        pending: pendingVerifications
      },
      volunteers: {
        active: activeVolunteers
      },
      tasks: {
        total: totalTasks
      },
      recentActivity: {
        users: recentUsers,
        donations: recentDonations,
        needs: recentNeeds
      }
    };
  }

  async getUsers({ role, status, search, page = 1, limit = 20 }) {
    const filter = {};
    if (role && role !== 'all') {
      filter.role = role;
    }
    if (status && status !== 'all') {
      filter.isActive = status === 'active';
    }
    if (search && search.trim()) {
      const reg = new RegExp(search.trim(), 'i');
      filter.$or = [
        { name: reg },
        { phone: reg },
        { email: reg },
        { 'location.city': reg }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .select('-passwordHash'),
      User.countDocuments(filter)
    ]);

    return { users, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
  }

  async updateUserStatus(userId, isActive) {
    return await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true, runValidators: true }
    ).select('-passwordHash');
  }

  async updateUserRole(userId, { role, activeRole }) {
    const update = {};
    if (role) {
      update.role = role;
      update.$addToSet = { roles: role };
    }
    if (activeRole) {
      update.activeRole = activeRole;
    }
    return await User.findByIdAndUpdate(userId, update, { new: true }).select('-passwordHash');
  }

  async getUserById(userId) {
    const user = await User.findById(userId).select('-passwordHash');
    if (!user) return null;

    const [donations, needs] = await Promise.all([
      Donation.find({ donorId: userId }).sort({ createdAt: -1 }).limit(10),
      Need.find({ receiverId: userId }).sort({ createdAt: -1 }).limit(10)
    ]);

    return { user, donations, needs };
  }

  async getVerifications({ status = 'pending', page = 1, limit = 20 }) {
    const filter = {
      receiverType: 'organization'
    };
    if (status && status !== 'all') {
      filter['organization.verificationStatus'] = status;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [organizations, total] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .select('-passwordHash'),
      User.countDocuments(filter)
    ]);

    return { organizations, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
  }

  async updateVerificationStatus(userId, { status, rejectionReason }) {
    const update = {
      'organization.verificationStatus': status
    };
    if (rejectionReason) {
      update['organization.rejectionReason'] = rejectionReason;
    }

    return await User.findByIdAndUpdate(userId, { $set: update }, { new: true }).select('-passwordHash');
  }

  async getDonations({ status, categoryId, search, page = 1, limit = 20 }) {
    const filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (categoryId && categoryId !== 'all') {
      filter.categoryId = categoryId;
    }
    if (search && search.trim()) {
      filter.title = new RegExp(search.trim(), 'i');
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [donations, total] = await Promise.all([
      Donation.find(filter)
        .populate('donorId', 'name phone email location')
        .populate('categoryId', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Donation.countDocuments(filter)
    ]);

    return { donations, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
  }

  async updateDonationStatus(donationId, status) {
    return await Donation.findByIdAndUpdate(
      donationId,
      { status },
      { new: true, runValidators: true }
    ).populate('donorId', 'name phone');
  }

  async getNeeds({ status, urgency, categoryId, search, page = 1, limit = 20 }) {
    const filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (urgency && urgency !== 'all') {
      filter.urgency = urgency;
    }
    if (categoryId && categoryId !== 'all') {
      filter.categoryId = categoryId;
    }
    if (search && search.trim()) {
      filter.title = new RegExp(search.trim(), 'i');
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [needs, total] = await Promise.all([
      Need.find(filter)
        .populate('receiverId', 'name phone email location receiverType organization')
        .populate('categoryId', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Need.countDocuments(filter)
    ]);

    return { needs, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
  }

  async updateNeedStatus(needId, status) {
    return await Need.findByIdAndUpdate(
      needId,
      { status },
      { new: true, runValidators: true }
    ).populate('receiverId', 'name phone');
  }

  async getVolunteers() {
    const volunteers = await User.find({ role: 'volunteer' })
      .select('-passwordHash')
      .sort({ createdAt: -1 });

    // Attach active task count to each volunteer
    const volunteerIds = volunteers.map(v => v._id);
    const activeTasks = await Task.aggregate([
      {
        $match: {
          volunteerId: { $in: volunteerIds },
          status: { $in: ['assigned', 'in_progress'] }
        }
      },
      {
        $group: {
          _id: '$volunteerId',
          count: { $sum: 1 }
        }
      }
    ]);

    const taskCountMap = {};
    activeTasks.forEach(t => {
      taskCountMap[t._id.toString()] = t.count;
    });

    return volunteers.map(v => ({
      ...v.toObject(),
      activeTasksCount: taskCountMap[v._id.toString()] || 0
    }));
  }

  async createDispatchTask({ title, description, donationId, needId, volunteerId, adminId, location, scheduledTime, urgency, peopleNeeded }) {
    const task = new Task({
      title,
      description,
      donationId: donationId || null,
      needId: needId || null,
      volunteerId: volunteerId || null,
      assignedBy: adminId,
      location: location || {},
      status: volunteerId ? 'assigned' : 'available',
      scheduledTime: scheduledTime || 'Today',
      urgency: urgency || 'medium',
      peopleNeeded: peopleNeeded || 1
    });

    await task.save();

    // If donation and need provided, optionally update their status to matched
    if (donationId) {
      await Donation.findByIdAndUpdate(donationId, { status: 'matched' });
    }
    if (needId) {
      await Need.findByIdAndUpdate(needId, { status: 'matched' });
    }

    return await Task.findById(task._id)
      .populate('volunteerId', 'name phone volunteerDetails')
      .populate('donationId', 'title quantity unit location')
      .populate('needId', 'title quantity unit location urgency');
  }

  async getTasks({ status, page = 1, limit = 20 }) {
    const filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .populate('volunteerId', 'name phone location volunteerDetails')
        .populate('donationId', 'title location')
        .populate('needId', 'title urgency location')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Task.countDocuments(filter)
    ]);

    return { tasks, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
  }

  async createVolunteer({ name, phone, email, password, location, volunteerDetails }) {
    const passwordHash = await bcrypt.hash(password, 10);
    const volunteer = new User({
      name,
      phone,
      email: email && email.trim() ? email.trim().toLowerCase() : undefined,
      passwordHash,
      role: 'volunteer',
      roles: ['volunteer'],
      activeRole: 'volunteer',
      location: {
        address: location?.address || '',
        city: location?.city || '',
        state: location?.state || '',
        pincode: location?.pincode || ''
      },
      volunteerDetails: {
        availability: volunteerDetails?.availability !== undefined ? volunteerDetails.availability : true,
        vehicleType: volunteerDetails?.vehicleType || 'two_wheeler'
      },
      isActive: true
    });

    await volunteer.save();
    return await User.findById(volunteer._id).select('-passwordHash');
  }
}

module.exports = new AdminRepository();
