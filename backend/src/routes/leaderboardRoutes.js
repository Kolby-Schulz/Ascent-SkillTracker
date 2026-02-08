const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const {
  getLeaderboard,
  getFilters,
  recordCompletion,
} = require('../controllers/leaderboardController');

router.get('/', protect, getLeaderboard);
router.get('/filters', protect, getFilters);
router.post('/complete', protect, recordCompletion);

module.exports = router;
