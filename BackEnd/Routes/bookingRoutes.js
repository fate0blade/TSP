
const express = require('express');
const router = express.Router();
const { authenticateUser, authorizeRoles } = require('../middleWare/authMiddleware');
const {
  getBookings, // Matches the renamed function in bookingController.js
  bookTickets, // Matches the renamed function in bookingController.js
  cancelBooking
} = require('../Controllers/bookingController');

router.get('/', authenticateUser, authorizeRoles('user'), getBookings);
router.post('/:eventId', authenticateUser, authorizeRoles('user'), bookTickets);
router.delete('/:bookingId', authenticateUser, authorizeRoles('user'), cancelBooking);

module.exports = router;
