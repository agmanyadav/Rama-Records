const express = require('express');
const router = express.Router();
const { getBeats, getFeaturedBeats, createBeat, deleteBeat } = require('../controllers/beatController');
const { protect, admin } = require('../middleware/auth');

router.route('/').get(getBeats).post(protect, admin, createBeat);
router.route('/featured').get(getFeaturedBeats);
router.route('/:id').delete(protect, admin, deleteBeat);

module.exports = router;
