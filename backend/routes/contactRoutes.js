const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const {
    createContact,
    getContacts,
    deleteContact,
} = require('../controllers/contactController.js');
const { protect, admin } = require('../middleware/auth.js');

// Rate limiter only for public form submissions
const formLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { message: 'Too many submissions, please try again later.' },
});

router.route('/').post(formLimiter, createContact).get(protect, admin, getContacts);
router.route('/:id').delete(protect, admin, deleteContact);

module.exports = router;
