const express = require('express');
const router = express.Router();
const { 
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventsByOrganizer,
    updateEventStatus
} = require('../Controllers/EventController');
const { 
    authenticateUser, 
    isOrganizer, 
    isAdmin,
    isOwnerOrAdmin 
} = require('../middleWare/authMiddleware');

// Public routes
router.get('/', getAllEvents); // Get all approved events
router.get('/:id', getEventById); // Get specific event details

// Protected routes - Organizer only
router.use(authenticateUser); // Apply authentication to all routes below
router.post('/', isOrganizer, createEvent);
router.get('/organizer/events', isOrganizer, getEventsByOrganizer);
router.put('/:id', isOrganizer, updateEvent);
router.delete('/:id', isOrganizer, deleteEvent);
router.patch('/:id/status', isOrganizer, updateEventStatus);

// Admin only routes
router.put('/:id/status', isAdmin, updateEventStatus); // Approve/reject events

module.exports = router;
