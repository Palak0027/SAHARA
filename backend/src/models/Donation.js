const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Donor ID is required']
    },
    title: {
      type: String,
      required: [true, 'Donation title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long']
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required']
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1']
    },
    unit: {
      type: String,
      required: [true, 'Unit of measurement is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    location: {
      address: {
        type: String,
        required: [true, 'Pickup address is required'],
        trim: true
      },
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true
      },
      state: {
        type: String,
        trim: true,
        default: ''
      },
      pincode: {
        type: String,
        trim: true,
        default: ''
      },
      coordinates: {
        lat: { type: Number, default: null },
        lng: { type: Number, default: null }
      }
    },
    availableFrom: {
      type: Date,
      required: [true, 'Available from date/time is required']
    },
    availableUntil: {
      type: Date,
      required: [true, 'Available until date/time is required']
    },
    // Food-specific fields for food safety compliance
    foodDetails: {
      preparedOn: {
        type: Date,
        default: null
      },
      safeUntil: {
        type: Date,
        default: null
      },
      isVeg: {
        type: Boolean,
        default: true
      }
    },
    status: {
      type: String,
      enum: {
        values: ['available', 'matched', 'accepted', 'in_transit', 'completed', 'cancelled'],
        message: '{VALUE} is not a valid donation status'
      },
      default: 'available'
    },
    deliveryPreference: {
      type: String,
      enum: ['volunteer_delivery', 'donor_dropoff', 'receiver_pickup', 'any'],
      default: 'any'
    },
    matchedWith: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Need',
      default: null
    },
    fulfillmentDetails: {
      mode: {
        type: String,
        enum: ['volunteer_delivery', 'donor_dropoff', 'receiver_pickup', 'unspecified'],
        default: 'unspecified'
      },
      matchedAt: { type: Date, default: null },
      notes: { type: String, default: '' }
    },
    images: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

// Indexes for fast lookup by donor, category, status, and location
donationSchema.index({ donorId: 1, status: 1 });
donationSchema.index({ categoryId: 1, status: 1 });
donationSchema.index({ 'location.city': 1, status: 1 });
donationSchema.index({ availableUntil: 1, status: 1 });

const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation;
