const express = require('express');
const router = express.Router();
const { authUser, googleAuth, getUserProfile } = require('../controllers/authController.js');
const { protect } = require('../middleware/auth.js');

router.post('/login', authUser);
router.post('/google', googleAuth);
router.route('/profile').get(protect, getUserProfile);

module.exports = router;
