const Contact = require('../models/Contact.js');

// @desc    Create contact message
// @route   POST /api/contact
// @access  Public
const createContact = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        const contact = new Contact({
            name,
            email,
            message,
        });

        const createdContact = await contact.save();
        res.status(201).json(createdContact);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find({}).sort({ createdAt: -1 });
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createContact,
    getContacts,
};
