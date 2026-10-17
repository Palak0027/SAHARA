const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
      match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number']
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: undefined,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address'
      ]
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      select: false // Never return password in queries by default
    },
    role: {
      type: String,
      required: [true, 'User role is required'],
      enum: {
        values: ['donor', 'receiver', 'volunteer', 'admin'],
        message: '{VALUE} is not a valid role'
      }
    },
    roles: {
      type: [String],
      enum: ['donor', 'receiver', 'volunteer', 'admin'],
      default: function () {
        return this.role ? [this.role] : ['donor'];
      }
    },
    activeRole: {
      type: String,
      enum: ['donor', 'receiver', 'volunteer', 'admin'],
      default: function () {
        return this.role || 'donor';
      }
    },
    location: {
      address: {
        type: String,
        required: [true, 'Address is required'],
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

    // Receiver Specific Fields
    receiverType: {
      type: String,
      enum: {
        values: ['individual', 'family', 'community', 'organization', null],
        message: '{VALUE} is not a valid receiver type'
      },
      default: null
    },

    // On-behalf-of Information (Optional for Receiver)
    onBehalfOf: {
      isOnBehalf: {
        type: Boolean,
        default: false
      },
      beneficiaryName: {
        type: String,
        trim: true
      },
      beneficiaryAge: {
        type: Number
      },
      relationship: {
        type: String,
        trim: true
      },
      beneficiaryLocation: {
        type: String,
        trim: true
      }
    },

    // Organization / NGO Specific Details
    organization: {
      orgName: {
        type: String,
        trim: true
      },
      regNumber: {
        type: String,
        trim: true
      },
      description: {
        type: String,
        trim: true
      },
      verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
      }
    },

    // Volunteer Specific Details
    volunteerDetails: {
      availability: {
        type: Boolean,
        default: true
      },
      vehicleType: {
        type: String,
        trim: true,
        default: 'two_wheeler'
      }
    },

    // Password reset credentials are stored hashed and expire quickly.
    passwordResetToken: {
      type: String,
      select: false
    },
    passwordResetExpires: {
      type: Date,
      select: false
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Sparse unique index on email so multiple null/undefined values don't collide
userSchema.index({ email: 1 }, { unique: true, sparse: true });

// Normalize empty email string to undefined before validation so sparse index works
userSchema.pre('validate', function (next) {
  if (this.email === '' || this.email === null) {
    this.email = undefined;
  }
  next();
});

// Compare entered password with stored bcrypt hash
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
