const express = require('express');
const router = express.Router();
const {
    createBooking,
    getBookings,
    updateBookingStatus,
    deleteBooking
} = require('../controllers/bookingController.js');
const { protect, admin } = require('../middleware/auth.js');

router.route('/').post(createBooking).get(protect, admin, getBookings);
router.route('/:id/status').put(protect, admin, updateBookingStatus);
router.route('/:id').delete(protect, admin, deleteBooking);

module.exports = router;
