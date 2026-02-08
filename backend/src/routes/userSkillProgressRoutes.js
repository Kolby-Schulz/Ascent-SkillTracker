const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const {
  upsertSkillProgress,
  getMyProgress,
} = require('../controllers/userSkillProgressController');

router.use(protect);

router.route('/').get(getMyProgress).post(upsertSkillProgress);

module.exports = router;
