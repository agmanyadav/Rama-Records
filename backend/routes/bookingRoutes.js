const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const {
    createBooking,
    getBookings,
    updateBookingStatus,
    deleteBooking
} = require('../controllers/bookingController.js');
const { protect, admin } = require('../middleware/auth.js');

// Rate limiter only for public form submissions
const formLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { message: 'Too many submissions, please try again later.' },
});

router.route('/').post(formLimiter, createBooking).get(protect, admin, getBookings);
router.route('/:id/status').put(protect, admin, updateBookingStatus);
router.route('/:id').delete(protect, admin, deleteBooking);

module.exports = router;
