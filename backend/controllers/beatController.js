const Beat = require('../models/Beat');

const MAX_FEATURED = 4;

// @desc    Fetch all beats
// @route   GET /api/beats
// @access  Public
const getBeats = async (req, res) => {
    try {
        const beats = await Beat.find({}).sort({ createdAt: -1 });
        res.json(beats);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Fetch featured beats (max 4, newest first)
// @route   GET /api/beats/featured
// @access  Public
const getFeaturedBeats = async (req, res) => {
    try {
        const beats = await Beat.find({ featured: true }).sort({ createdAt: -1 }).limit(MAX_FEATURED);
        res.json(beats);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a beat
// @route   POST /api/beats
// @access  Private/Admin
const createBeat = async (req, res) => {
    try {
        const { title, price, audioFile, coverImage, tags, featured } = req.body;

        // If marking as featured, enforce the cap: unfeature the oldest ones beyond limit
        if (featured) {
            const currentFeatured = await Beat.find({ featured: true }).sort({ createdAt: -1 });
            if (currentFeatured.length >= MAX_FEATURED) {
                // Unfeature the oldest ones to make room for this new one
                const toUnfeature = currentFeatured.slice(MAX_FEATURED - 1);
                for (const item of toUnfeature) {
                    item.featured = false;
                    await item.save();
                }
            }
        }

        const beat = new Beat({ title, price, audioFile, coverImage, tags, featured });
        const createdBeat = await beat.save();
        res.status(201).json(createdBeat);
    } catch (error) {
        res.status(400).json({ message: 'Invalid beat data' });
    }
};

// @desc    Delete a beat
// @route   DELETE /api/beats/:id
// @access  Private/Admin
const deleteBeat = async (req, res) => {
    try {
        const beat = await Beat.findById(req.params.id);
        if (beat) {
            await beat.deleteOne();
            res.json({ message: 'Beat removed' });
        } else {
            res.status(404).json({ message: 'Beat not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getBeats, getFeaturedBeats, createBeat, deleteBeat };
