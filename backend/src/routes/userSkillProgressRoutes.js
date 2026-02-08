const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const {
  upsertSkillProgress,
  getMyProgress,
  getUsersLearningSkill,
  deleteSkillProgress,
} = require('../controllers/userSkillProgressController');

router.use(protect);

router.get('/learning', getUsersLearningSkill);
router.delete('/', deleteSkillProgress);
router.route('/').get(getMyProgress).post(upsertSkillProgress);

module.exports = router;
