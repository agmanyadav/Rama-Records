const Booking = require('../models/Booking.js');

// @desc    Get bookings for the logged-in user (by email)
// @route   GET /api/user/bookings
// @access  Private
const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ email: req.user.email }).sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getUserBookings,
};
