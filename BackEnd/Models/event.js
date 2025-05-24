const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,

    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },

  totalTickets: {
    type: Number,
    required: true
  },
  availableTickets: {
    type: Number,

    required: true
  },
  price: {
    type: Number,

    required: true,
    min: 0
  },
  totalTickets: {
    type: Number,
    required: true,
    min: 1
  },
  remainingTickets: {
    type: Number,
    required: true
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',

    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'declined'],
    default: 'pending'
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);
