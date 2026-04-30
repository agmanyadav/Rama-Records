const express = require('express');
const router = express.Router();
const { getReleases, createRelease, deleteRelease } = require('../controllers/releaseController');
const { protect } = require('../middleware/auth');

router.route('/')
    .get(getReleases)
    .post(protect, createRelease);

router.route('/:id')
    .delete(protect, deleteRelease);

module.exports = router;
