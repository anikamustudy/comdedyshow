const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  showId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Show',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false  // Guest bookings allowed
  },
  userEmail: {
    type: String,
    required: true
  },
  userName: String,
  seats: [{
    seatNumber: String,
    row: String
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  paymentId: String,
  orderId: String,
  signature: String,
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'cancelled'],
    default: 'pending'
  },
  tickets: [{
    ticketId: String,
    seatNumber: String,
    qrCode: String,
    used: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);

