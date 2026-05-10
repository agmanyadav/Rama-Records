const express = require('express');
const router = express.Router();
const { getUserBookings } = require('../controllers/userBookingController.js');
const { protect } = require('../middleware/auth.js');

router.route('/bookings').get(protect, getUserBookings);

module.exports = router;
