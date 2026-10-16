const mongoose = require('mongoose');

const needSchema = new mongoose.Schema(
  {
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Receiver ID is required']
    },
    title: {
      type: String,
      required: [true, 'Need request title is required'],
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
    urgency: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high', 'critical'],
        message: '{VALUE} is not a valid urgency level'
      },
      default: 'medium'
    },
    requiredBy: {
      type: Date,
      required: [true, 'Required by date is required']
    },
    description: {
      type: String,
      required: [true, 'Need description is required'],
      trim: true
    },
    location: {
      address: {
        type: String,
        required: [true, 'Delivery address is required'],
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
    receiverType: {
      type: String,
      enum: ['individual', 'family', 'community', 'organization'],
      default: 'individual'
    },
    onBehalfOf: {
      isOnBehalf: {
        type: Boolean,
        default: false
      },
      beneficiaryName: {
        type: String,
        trim: true,
        default: ''
      },
      beneficiaryAge: {
        type: Number,
        default: null
      },
      relationship: {
        type: String,
        trim: true,
        default: ''
      },
      beneficiaryLocation: {
        type: String,
        trim: true,
        default: ''
      }
    },
    status: {
      type: String,
      enum: {
        values: ['open', 'matched', 'accepted', 'in_transit', 'fulfilled', 'cancelled'],
        message: '{VALUE} is not a valid need status'
      },
      default: 'open'
    },
    deliveryPreference: {
      type: String,
      enum: ['volunteer_delivery', 'donor_dropoff', 'receiver_pickup', 'any'],
      default: 'any'
    },
    matchedWith: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donation',
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
    }
  },
  {
    timestamps: true
  }
);

// Performance indexes for search, status, and smart matching
needSchema.index({ receiverId: 1, status: 1 });
needSchema.index({ categoryId: 1, status: 1 });
needSchema.index({ 'location.city': 1, status: 1 });
needSchema.index({ urgency: 1, status: 1 });
needSchema.index({ requiredBy: 1, status: 1 });

const Need = mongoose.model('Need', needSchema);

module.exports = Need;
