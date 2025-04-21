
const express = require('express');
const router = express.Router();
const { authenticateUser, authorizeRoles } = require('../middleware/auth');
const {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  updateEventStatus,
  eventAnalytics
} = require('../controllers/eventController');

// Public
router.get('/', getAllEvents);

// Organizer
router.post('/', authenticateUser, authorizeRoles('organizer'), createEvent);
router.put('/:id', authenticateUser, authorizeRoles('organizer'), updateEvent);
router.delete('/:id', authenticateUser, authorizeRoles('organizer'), deleteEvent);
router.get('/analytics', authenticateUser, authorizeRoles('organizer'), eventAnalytics);

// Admin
router.put('/:id/status', authenticateUser, authorizeRoles('admin'), updateEventStatus);

module.exports = router;
