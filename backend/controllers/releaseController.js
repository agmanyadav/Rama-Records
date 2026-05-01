const Release = require('../models/Release.js');

// @desc    Fetch all releases
// @route   GET /api/releases
// @access  Public
const getReleases = async (req, res) => {
    try {
        const releases = await Release.find({}).sort({ createdAt: -1 });
        res.json(releases);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch releases', error: error.message });
    }
};

// @desc    Create a release
// @route   POST /api/releases
// @access  Private/Admin
const createRelease = async (req, res) => {
    try {
        const { youtubeUrl, title } = req.body;

        if (!youtubeUrl) {
            return res.status(400).json({ message: 'YouTube URL is required' });
        }

        const release = new Release({
            youtubeUrl,
            title: title || '',
        });

        const createdRelease = await release.save();
        res.status(201).json(createdRelease);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create release', error: error.message });
    }
};

// @desc    Delete a release
// @route   DELETE /api/releases/:id
// @access  Private/Admin
const deleteRelease = async (req, res) => {
    try {
        const release = await Release.findById(req.params.id);

        if (release) {
            await release.deleteOne();
            res.json({ message: 'Release removed' });
        } else {
            res.status(404).json({ message: 'Release not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete release', error: error.message });
    }
};

const updateRelease = async (req, res) => {
    try {
        const { youtubeUrl, title } = req.body;

        const release = await Release.findById(req.params.id);

        if (release) {
            release.youtubeUrl = youtubeUrl || release.youtubeUrl;
            release.title = title || release.title;

            const updatedRelease = await release.save();
            res.json(updatedRelease);
        } else {
            res.status(404).json({ message: 'Release not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to update release', error: error.message });
    }
};

module.exports = {
    getReleases,
    createRelease,
    deleteRelease,
    updateRelease,
};
