const express = require('express');
const { protect } = require('../middlewares/auth');
const {
  createPost,
  getFeed,
  toggleLike,
  getUserPosts,
} = require('../controllers/postController');

const router = express.Router();

router.use(protect); // All routes require authentication

router.post('/', createPost);
router.get('/feed', getFeed);
router.put('/:postId/like', toggleLike);
router.get('/user/:userId', getUserPosts);

module.exports = router;
