
const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const { authenticateUser, authorizeRoles } = require('../middleWare/authMiddleware.js');


// Public (handled in auth routes): register, login, forgetPassword

// Admin-only routes

router.get('/', authenticateUser, authorizeRoles('admin'), userController.getAllUsers);
router.get('/:id', authenticateUser, authorizeRoles('admin'), userController.getUserById);
router.put('/:id', authenticateUser, authorizeRoles('admin'), userController.updateUserRole);
router.delete('/:id', authenticateUser, authorizeRoles('admin'), userController.deleteUser);

// Authenticated users
router.get('/profile', authenticateUser, userController.getProfile);
router.put('/profile', authenticateUser, userController.updateProfile);

// Standard User bookings
router.get('/bookings', authenticateUser, authorizeRoles('user'), userController.getUserBookings);

// Organizer events and analytics
router.get('/events', authenticateUser, authorizeRoles('organizer'), userController.getMyEvents);
router.get('/events/analytics', authenticateUser, authorizeRoles('organizer'), userController.getEventAnalytics);

module.exports = router;

