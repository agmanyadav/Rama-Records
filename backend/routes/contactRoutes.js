const express = require('express');
const router = express.Router();
const {
    createContact,
    getContacts,
    deleteContact,
} = require('../controllers/contactController.js');
const { protect, admin } = require('../middleware/auth.js');

router.route('/').post(createContact).get(protect, admin, getContacts);
router.route('/:id').delete(protect, admin, deleteContact);

module.exports = router;
