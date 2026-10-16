const Donation = require('../models/Donation');
const Need = require('../models/Need');
const Task = require('../models/Task');
const AppError = require('../utils/AppError');

class MatchService {
  /**
   * Calculate compatibility and logistics mode between a donation and a need
   */
  calculateLogisticsMode(donation, need) {
    const donorPref = donation.deliveryPreference || 'any';
    const receiverPref = need.deliveryPreference || 'any';

    // If receiver can self-pickup
    if (receiverPref === 'receiver_pickup' || (donorPref === 'any' && receiverPref === 'receiver_pickup')) {
      return {
        recommendedMode: 'receiver_pickup',
        label: 'Receiver Self-Pickup',
        description: 'Receiver or their volunteer vehicle will collect supplies directly from donor location.'
      };
    }

    // If donor is willing to deliver/drop-off
    if (donorPref === 'donor_dropoff' || (receiverPref === 'any' && donorPref === 'donor_dropoff')) {
      return {
        recommendedMode: 'donor_dropoff',
        label: 'Donor Direct Drop-Off',
        description: 'Donor will transport and deliver supplies directly to the destination address.'
      };
    }

    // Default: SAHARA Volunteer Delivery
    return {
      recommendedMode: 'volunteer_delivery',
      label: 'SAHARA Volunteer Delivery',
      description: 'A verified SAHARA community volunteer will be dispatched for doorstep pickup and drop-off.'
    };
  }

  /**
   * Calculate match score percentage (0 - 100)
   */
  computeScore(donation, need) {
    let score = 40; // Base score for same category

    // City proximity bonus
    const donCity = donation.location?.city?.toLowerCase()?.trim() || '';
    const needCity = need.location?.city?.toLowerCase()?.trim() || '';
    if (donCity && needCity && donCity === needCity) {
      score += 35;
    }

    // Quantity alignment bonus
    const donQty = donation.quantity || 1;
    const needQty = need.quantity || 1;
    const qtyRatio = Math.min(donQty, needQty) / Math.max(donQty, needQty);
    score += Math.round(qtyRatio * 15);

    // Urgency weighting
    if (need.urgency === 'critical') score += 10;
    else if (need.urgency === 'high') score += 7;
    else if (need.urgency === 'medium') score += 4;

    return Math.min(100, Math.max(score, 50));
  }

  /**
   * Find matching needs for a donor
   */
  async getDonorSmartMatches(donorId) {
    const activeDonations = await Donation.find({
      donorId,
      status: 'available'
    }).populate('categoryId', 'name description');

    if (!activeDonations || activeDonations.length === 0) {
      return [];
    }

    const matches = [];

    for (const donation of activeDonations) {
      const candidateNeeds = await Need.find({
        categoryId: donation.categoryId._id,
        status: 'open'
      })
        .populate('receiverId', 'name phone receiverType organization location')
        .populate('categoryId', 'name description');

      for (const need of candidateNeeds) {
        const score = this.computeScore(donation, need);
        const logistics = this.calculateLogisticsMode(donation, need);

        matches.push({
          matchId: `${donation._id}_${need._id}`,
          score,
          donation: {
            _id: donation._id,
            title: donation.title,
            quantity: donation.quantity,
            unit: donation.unit,
            category: donation.categoryId?.name,
            location: donation.location,
            availableUntil: donation.availableUntil
          },
          need: {
            _id: need._id,
            title: need.title,
            quantity: need.quantity,
            unit: need.unit,
            urgency: need.urgency,
            category: need.categoryId?.name,
            receiverName: need.receiverId?.name,
            receiverType: need.receiverType,
            organization: need.receiverId?.organization?.orgName,
            location: need.location,
            requiredBy: need.requiredBy
          },
          logistics
        });
      }
    }

    // Sort by highest score first
    return matches.sort((a, b) => b.score - a.score);
  }

  /**
   * Find matching donations for a receiver
   */
  async getReceiverSmartMatches(receiverId) {
    const activeNeeds = await Need.find({
      receiverId,
      status: 'open'
    }).populate('categoryId', 'name description');

    if (!activeNeeds || activeNeeds.length === 0) {
      return [];
    }

    const matches = [];

    for (const need of activeNeeds) {
      const candidateDonations = await Donation.find({
        categoryId: need.categoryId._id,
        status: 'available'
      })
        .populate('donorId', 'name phone location')
        .populate('categoryId', 'name description');

      for (const donation of candidateDonations) {
        const score = this.computeScore(donation, need);
        const logistics = this.calculateLogisticsMode(donation, need);

        matches.push({
          matchId: `${donation._id}_${need._id}`,
          score,
          need: {
            _id: need._id,
            title: need.title,
            quantity: need.quantity,
            unit: need.unit,
            urgency: need.urgency,
            category: need.categoryId?.name,
            location: need.location,
            requiredBy: need.requiredBy
          },
          donation: {
            _id: donation._id,
            title: donation.title,
            quantity: donation.quantity,
            unit: donation.unit,
            category: donation.categoryId?.name,
            donorName: donation.donorId?.name,
            location: donation.location,
            availableUntil: donation.availableUntil,
            foodDetails: donation.foodDetails
          },
          logistics
        });
      }
    }

    return matches.sort((a, b) => b.score - a.score);
  }

  /**
   * Pair a donation and a need with a chosen logistics mode
   */
  async confirmMatch({ donationId, needId, userId, userRole, fulfillmentMode, notes }) {
    const [donation, need] = await Promise.all([
      Donation.findById(donationId).populate('donorId', 'name phone location'),
      Need.findById(needId).populate('receiverId', 'name phone location organization')
    ]);

    if (!donation) throw new AppError('Donation not found', 404);
    if (!need) throw new AppError('Need request not found', 404);

    if (donation.status !== 'available') {
      throw new AppError(`Donation is no longer available (Current status: ${donation.status})`, 400);
    }
    if (need.status !== 'open') {
      throw new AppError(`Need request is no longer open (Current status: ${need.status})`, 400);
    }

    const validModes = ['volunteer_delivery', 'donor_dropoff', 'receiver_pickup'];
    const chosenMode = validModes.includes(fulfillmentMode) ? fulfillmentMode : 'volunteer_delivery';

    const matchTimestamp = new Date();

    // 1. Update Donation
    donation.status = 'matched';
    donation.matchedWith = need._id;
    donation.fulfillmentDetails = {
      mode: chosenMode,
      matchedAt: matchTimestamp,
      notes: notes || ''
    };
    await donation.save();

    // 2. Update Need
    need.status = 'matched';
    need.matchedWith = donation._id;
    need.fulfillmentDetails = {
      mode: chosenMode,
      matchedAt: matchTimestamp,
      notes: notes || ''
    };
    await need.save();

    // 3. If volunteer delivery required, dispatch a volunteer Task
    let task = null;
    if (chosenMode === 'volunteer_delivery') {
      task = await Task.create({
        title: `Deliver ${donation.quantity} ${donation.unit} (${donation.title}) to ${need.receiverId?.name || 'Receiver'}`,
        description: `Pickup from ${donation.location?.address}, ${donation.location?.city}. Deliver to ${need.location?.address}, ${need.location?.city}. Notes: ${notes || 'Handle with care'}`,
        taskType: 'delivery',
        donationId: donation._id,
        needId: need._id,
        urgency: need.urgency || 'medium',
        location: {
          address: need.location?.address || '',
          city: need.location?.city || donation.location?.city || '',
          state: need.location?.state || '',
          pincode: need.location?.pincode || ''
        },
        status: 'available',
        scheduledTime: need.requiredBy ? new Date(need.requiredBy).toLocaleString() : ''
      });
    }

    return {
      success: true,
      message: chosenMode === 'volunteer_delivery'
        ? 'Matched successfully! A task has been dispatched to local volunteers for delivery.'
        : chosenMode === 'receiver_pickup'
        ? 'Matched successfully! Receiver has been confirmed for self-pickup from donor address.'
        : 'Matched successfully! Donor has confirmed direct drop-off to receiver location.',
      fulfillmentMode: chosenMode,
      task: task ? { _id: task._id, status: task.status } : null,
      donation: { _id: donation._id, status: donation.status },
      need: { _id: need._id, status: need.status }
    };
  }
}

module.exports = new MatchService();
