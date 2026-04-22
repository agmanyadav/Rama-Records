const Song = require('../models/Song.js');

const MAX_FEATURED = 4;

// @desc    Fetch all songs
// @route   GET /api/songs
// @access  Public
const getSongs = async (req, res) => {
    try {
        const songs = await Song.find({}).sort({ order: 1 });
        res.json(songs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Fetch featured songs (max 4)
// @route   GET /api/songs/featured
// @access  Public
const getFeaturedSongs = async (req, res) => {
    try {
        const songs = await Song.find({ featured: true }).sort({ createdAt: -1 }).limit(MAX_FEATURED);
        res.json(songs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Fetch single song
// @route   GET /api/songs/:id
// @access  Public
const getSongById = async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);

        if (song) {
            res.json(song);
        } else {
            res.status(404).json({ message: 'Song not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a song
// @route   POST /api/songs
// @access  Private/Admin
const createSong = async (req, res) => {
    try {
        const { title, artists, album, duration, coverImage, audioFile, dsps, featured, order } = req.body;

        // If marking as featured, enforce the cap
        if (featured) {
            const currentFeatured = await Song.find({ featured: true }).sort({ createdAt: -1 });
            if (currentFeatured.length >= MAX_FEATURED) {
                const toUnfeature = currentFeatured.slice(MAX_FEATURED - 1);
                for (const item of toUnfeature) {
                    item.featured = false;
                    await item.save();
                }
            }
        }

        const song = new Song({
            title, artists, album, duration, coverImage, audioFile, dsps, featured, order
        });

        const createdSong = await song.save();
        res.status(201).json(createdSong);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a song
// @route   PUT /api/songs/:id
// @access  Private/Admin
const updateSong = async (req, res) => {
    try {
        const { title, artists, album, duration, coverImage, audioFile, dsps, featured, order } = req.body;

        const song = await Song.findById(req.params.id);

        if (song) {
            song.title = title || song.title;
            song.artists = artists || song.artists;
            song.album = album || song.album;
            song.duration = duration || song.duration;
            song.coverImage = coverImage || song.coverImage;
            song.audioFile = audioFile || song.audioFile;
            song.dsps = dsps || song.dsps;
            song.featured = featured !== undefined ? featured : song.featured;
            song.order = order || song.order;

            const updatedSong = await song.save();
            res.json(updatedSong);
        } else {
            res.status(404).json({ message: 'Song not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a song
// @route   DELETE /api/songs/:id
// @access  Private/Admin
const deleteSong = async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);

        if (song) {
            await song.deleteOne();
            res.json({ message: 'Song removed' });
        } else {
            res.status(404).json({ message: 'Song not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getSongs,
    getFeaturedSongs,
    getSongById,
    createSong,
    updateSong,
    deleteSong,
};
