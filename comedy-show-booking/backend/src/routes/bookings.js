const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');
const Show = require('../models/Show');
const { generateQR } = require('../utils/qrGenerator');
const router = express.Router();

// Initialize Razorpay
const rzp = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc Create booking order
// @route POST /api/bookings/order
router.post('/order', async (req, res) => {
  try {
    const { showId, seats, totalAmount, userEmail, userName } = req.body;

    // Verify seats availability
    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    // Create order
    const order = await rzp.orders.create({
      amount: totalAmount * 100,  // Razorpay uses paise
      currency: 'INR',
      receipt: `show_${showId}_${Date.now()}`,
    });

    // Save pending booking
    const booking = await Booking.create({
      showId,
      userEmail,
      userName,
      seats,
      totalAmount,
      orderId: order.id
    });

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      bookingId: booking._id
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc Verify payment and generate tickets
// @route POST /api/bookings/verify
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    // Verify signature
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    // Update booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = 'paid';
    booking.paymentId = razorpay_payment_id;

    // Generate QR codes for tickets
    const tickets = booking.seats.map(async (seat, index) => {
      const ticketId = `TKT_${booking._id}_${index}_${Date.now()}`;
      const qrData = `ticket:${ticketId}:${booking.showId}:${seat.seatNumber}`;
      const qrCode = await generateQR(qrData);
      
      return {
        ticketId,
        seatNumber: seat.seatNumber,
        qrCode
      };
    });

    booking.tickets = await Promise.all(tickets);
    await booking.save();

    res.json({
      success: true,
      message: 'Payment verified! Tickets generated.',
      booking: {
        _id: booking._id,
        tickets: booking.tickets,
        show: booking.showId
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc Get user bookings
router.get('/my-bookings', async (req, res) => {
  try {
    const bookings = await Booking.find({ userEmail: req.query.email })
      .populate('showId', 'title date venue')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

