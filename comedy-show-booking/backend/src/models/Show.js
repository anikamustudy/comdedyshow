const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
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
  venue: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    required: true  // YouTube/Vimeo embed URL
  },
  thumbnail: String,
  price: {
    type: Number,
    required: true,
    min: 0
  },
  totalSeats: {
    type: Number,
    default: 100
  },
  availableSeats: [{
    seatNumber: String,
    row: String,
    status: {
      type: String,
      enum: ['available', 'booked'],
      default: 'available'
    }
  }],
  comedian: String,
  duration: {
    type: Number,
    default: 90  // minutes
  },
  status: {
    type: String,
    enum: ['upcoming', 'live', 'completed'],
    default: 'upcoming'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Show', showSchema);

