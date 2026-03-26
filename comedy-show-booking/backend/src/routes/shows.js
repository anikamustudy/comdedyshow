const express = require('express');
const router = express.Router();
const Show = require('../models/Show');

// @desc    Get all shows
// @route   GET /api/shows
router.get('/', async (req, res) => {
  try {
    const { date, search } = req.query;
    let filter = {};
    
    if (date) {
      const start = new Date(date);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      filter.date = { $gte: start, $lt: end };
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { comedian: { $regex: search, $options: 'i' } }
      ];
    }
    
    const shows = await Show.find(filter)
      .sort({ date: 1 })
      .select('-availableSeats');
    
    res.json({
      success: true,
      count: shows.length,
      data: shows
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get single show
// @route   GET /api/shows/:id
router.get('/:id', async (req, res) => {
  try {
    const show = await Show.findById(req.params.id);
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }
    res.json({ success: true, data: show });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Sample data (temporary)
router.post('/seed', async (req, res) => {
  try {
    const sampleShows = [
      {
        title: 'Zakir Khan Live',
        description: 'Haasil - The ultimate stand-up experience',
        date: new Date('2024-12-15T20:00:00'),
        venue: 'Bal Gandharva Auditorium, Pune',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1', 
        thumbnail: 'https://i.imgur.com/zakir.jpg',
        price: 799,
        comedian: 'Zakir Khan',
        totalSeats: 200
      },
      {
        title: 'Biswa Kalyan Live',
        description: 'Mind Your Language tour',
        date: new Date('2024-12-20T19:30:00'),
        venue: 'Jawahar Lal Nehru Auditorium',
        videoUrl: 'https://www.youtube.com/embed/VIDEO_ID_HERE',
        price: 999,
        comedian: 'Biswa Kalyan Rath'
      }
    ];
    
    await Show.deleteMany({});
    const created = await Show.insertMany(sampleShows);
    res.json({ success: true, count: created.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

