const User = require('../models/User.js');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Auth user with email/password
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Auth user with Google OAuth
// @route   POST /api/auth/google
// @access  Public
const googleAuth = async (req, res) => {
    try {
        const { credential } = req.body;
        console.log('Google Auth attempt. GOOGLE_CLIENT_ID set:', !!process.env.GOOGLE_CLIENT_ID);
        console.log('ADMIN_EMAIL set:', !!process.env.ADMIN_EMAIL);

        if (!credential) {
            return res.status(400).json({ message: 'No credential provided.' });
        }

        // Verify the Google ID token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, picture, sub: googleId } = payload;
        console.log('Google Auth verified email:', email);

        // Check if this email is the authorized admin
        const adminEmail = process.env.ADMIN_EMAIL;
        if (email !== adminEmail) {
            console.warn('Admin email mismatch. Got:', email, 'Expected:', adminEmail);
            return res.status(403).json({ message: 'This Google account is not authorized as admin.' });
        }

        // Find or create the user
        let user = await User.findOne({ email });

        if (!user) {
            // Create a new admin user from Google
            user = await User.create({
                name: name,
                email: email,
                password: `google_${googleId}_${Date.now()}`, // Random password since they use Google
                isAdmin: true,
                googleId: googleId,
            });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            picture: picture,
            isAdmin: true,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error('Google Auth Error:', error.message);
        console.error('Google Auth Full Error:', error);
        res.status(401).json({ message: 'Google authentication failed: ' + error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    authUser,
    googleAuth,
    getUserProfile,
};
