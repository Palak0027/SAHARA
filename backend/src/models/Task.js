const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long']
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    category: {
      type: String,
      default: 'General'
    },
    taskType: {
      type: String,
      enum: ['pickup', 'delivery', 'distribution', 'sorting', 'general'],
      default: 'pickup'
    },
    donationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donation',
      default: null
    },
    needId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Need',
      default: null
    },
    volunteerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    location: {
      address: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' }
    },
    status: {
      type: String,
      enum: ['available', 'assigned', 'in_progress', 'completed', 'cancelled'],
      default: 'available'
    },
    urgency: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    scheduledTime: {
      type: String,
      default: ''
    },
    peopleNeeded: {
      type: Number,
      default: 1
    }
  },
  {
    timestamps: true
  }
);

taskSchema.index({ volunteerId: 1, status: 1 });
taskSchema.index({ status: 1 });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
