const express = require('express');
const router = express.Router();
const {
    getSongs,
    getFeaturedSongs,
    getSongById,
    createSong,
    updateSong,
    deleteSong,
} = require('../controllers/songController.js');
const { protect, admin } = require('../middleware/auth.js');

router.route('/').get(getSongs).post(protect, admin, createSong);
router.get('/featured', getFeaturedSongs);
router
    .route('/:id')
    .get(getSongById)
    .put(protect, admin, updateSong)
    .delete(protect, admin, deleteSong);

module.exports = router;
