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
                role: user.isAdmin ? 'admin' : 'user',
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Auth user with Google OAuth (admin + normal users)
// @route   POST /api/auth/google
// @access  Public
const googleAuth = async (req, res) => {
    try {
        const { credential } = req.body;
        console.log('Google Auth attempt. GOOGLE_CLIENT_ID set:', !!process.env.GOOGLE_CLIENT_ID);
        console.log('ADMIN_EMAILS set:', !!(process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL));

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

        // Check if this email is an authorized admin
        const envAdminEmails = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || '';
        const adminEmails = envAdminEmails.split(',').map(e => e.trim());
        const isAdmin = adminEmails.includes(email);

        // Find or create the user
        let user = await User.findOne({ email });

        if (!user) {
            // Create a new user from Google
            user = await User.create({
                name: name,
                email: email,
                isAdmin: isAdmin,
                googleId: googleId,
                profilePicture: picture || '',
            });
        } else {
            // Update googleId and profilePicture if not already set
            if (!user.googleId) user.googleId = googleId;
            if (!user.profilePicture && picture) user.profilePicture = picture;
            // Sync admin status
            user.isAdmin = isAdmin;
            await user.save();
        }

        const role = isAdmin ? 'admin' : 'user';
        console.log(`Google Auth success: ${email}, role: ${role}`);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            picture: picture,
            profilePicture: user.profilePicture || picture,
            phone: user.phone || '',
            bio: user.bio || '',
            isAdmin: isAdmin,
            role: role,
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
                role: user.isAdmin ? 'admin' : 'user',
                phone: user.phone || '',
                profilePicture: user.profilePicture || '',
                bio: user.bio || '',
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
            user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                role: updatedUser.isAdmin ? 'admin' : 'user',
                phone: updatedUser.phone || '',
                profilePicture: updatedUser.profilePicture || '',
                bio: updatedUser.bio || '',
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
    updateUserProfile,
};
