const express = require('express');
const router = express.Router();
const { getGallery, getFeaturedGallery, createGallery, deleteGallery } = require('../controllers/galleryController');
const { protect, admin } = require('../middleware/auth');

router.route('/').get(getGallery).post(protect, admin, createGallery);
router.route('/featured').get(getFeaturedGallery);
router.route('/:id').delete(protect, admin, deleteGallery);

module.exports = router;
