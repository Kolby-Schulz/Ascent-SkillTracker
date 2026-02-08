const express = require('express');
const { protect } = require('../middlewares/auth');
const {
  startStep,
  completeStep,
  getFriendProgress,
} = require('../controllers/stepProgressController');

const router = express.Router();

router.use(protect); // All routes require authentication

router.post('/start', startStep);
router.post('/complete', completeStep);
router.get('/friends/:roadmapId', getFriendProgress);

module.exports = router;
