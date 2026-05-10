const express = require('express');
const router = express.Router();
const { getServices, getFeaturedServices, createService, deleteService } = require('../controllers/serviceController');
const { protect, admin } = require('../middleware/auth');

router.route('/').get(getServices).post(protect, admin, createService);
router.route('/featured').get(getFeaturedServices);
router.route('/:id').delete(protect, admin, deleteService);

module.exports = router;
