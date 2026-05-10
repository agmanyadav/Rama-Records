const express = require('express');
const router = express.Router();
const { getReleases, createRelease, deleteRelease, updateRelease } = require('../controllers/releaseController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
    .get(getReleases)
    .post(protect, admin, createRelease);

router.route('/:id')
    .put(protect, admin, updateRelease)
    .delete(protect, admin, deleteRelease);

module.exports = router;
