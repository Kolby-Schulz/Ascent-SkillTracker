const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const {
  createGuide,
  getGuide,
  likeGuide,
  listGuides,
} = require('../controllers/guideController');

router.use(protect);

router.route('/').get(listGuides).post(createGuide);
router.get('/:id', getGuide);
router.post('/:id/like', likeGuide);

module.exports = router;
