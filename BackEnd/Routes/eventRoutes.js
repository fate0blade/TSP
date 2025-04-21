
const express = require('express');
const router = express.Router();
const { authenticateUser, authorizeRoles } = require('../middleWare/authMiddleware');
const {
    getAllEvents,
    createEvent,
    editEvent,
    deleteEvent,
    updateEventStatus,
    getEventAnalytics
} = require('../Controllers/EventController');

// Public route
router.get('/', getAllEvents);

// Organizer routes
router.post('/', authenticateUser, authorizeRoles('organizer'), createEvent);
router.put('/:id', authenticateUser, authorizeRoles('organizer'), editEvent);
router.delete('/:id', authenticateUser, authorizeRoles('organizer'), deleteEvent);
router.get('/analytics', authenticateUser, authorizeRoles('organizer'), getEventAnalytics);

// Admin route
router.put('/:id/status', authenticateUser, authorizeRoles('admin'), updateEventStatus);

module.exports = router;
