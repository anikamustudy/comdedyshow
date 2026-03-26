const express = require('express');
const { protect, admin } = require('../middleware/auth');
const Show = require('../models/Show');
const Booking = require('../models/Booking');
const User = require('../models/User');
const router = express.Router();

// Apply auth middleware to all admin routes
router.use(protect);
router.use(admin);

// @desc Get dashboard stats
// @route GET /api/admin/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const stats = {
      totalShows: await Show.countDocuments(),
      upcomingShows: await Show.countDocuments({ status: 'upcoming' }),
      totalBookings: await Booking.countDocuments({ status: 'paid' }),
      totalRevenue: await Booking.aggregate([
        { $match: { status: 'paid' } },
        { $group: { _sum: { $sum: '$totalAmount' } } }
      ])
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc Create new show
// @route POST /api/admin/shows
router.post('/shows', async (req, res) => {
  try {
    const show = await Show.create(req.body);
    res.status(201).json({ success: true, data: show });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc Delete show
// @route DELETE /api/admin/shows/:id
router.delete('/shows/:id', async (req, res) => {
  try {
    const show = await Show.findByIdAndDelete(req.params.id);
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
  }
    res.json({ success: true, message: 'Show deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc Get all bookings
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('showId', 'title date')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

