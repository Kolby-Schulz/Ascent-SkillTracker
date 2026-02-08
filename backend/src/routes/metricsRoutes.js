const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { getMyMetrics } = require('../controllers/metricsController');

router.use(protect);

router.get('/', getMyMetrics);

module.exports = router;
