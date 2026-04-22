const express = require('express');
const router = express.Router();
const {
    createContact,
    getContacts,
} = require('../controllers/contactController.js');
const { protect, admin } = require('../middleware/auth.js');

router.route('/').post(createContact).get(protect, admin, getContacts);

module.exports = router;
