const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// Public (handled in auth routes): register, login, forgetPassword

// Admin-only routes
router.get('/', protect, authorize('admin'), userController.getAllUsers);
router.get('/:id', protect, authorize('admin'), userController.getUserById);
router.put('/:id', protect, authorize('admin'), userController.updateUserRole);
router.delete('/:id', protect, authorize('admin'), userController.deleteUser);

// Authenticated users
router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, userController.updateProfile);

// Standard User bookings
router.get('/bookings', protect, authorize('user'), userController.getUserBookings);

// Organizer events and analytics
router.get('/events', protect, authorize('organizer'), userController.getMyEvents);
router.get('/events/analytics', protect, authorize('organizer'), userController.getEventAnalytics);

module.exports = router;
