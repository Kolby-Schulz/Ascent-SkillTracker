const express = require('express');
const { protect } = require('../middlewares/auth');
const {
  sendFriendRequest,
  acceptFriendRequest,
  removeFriend,
  getFriends,
  getFriendRequests,
  searchUsers,
  getAllUsers,
} = require('../controllers/friendController');

const router = express.Router();

router.use(protect); // All routes require authentication

router.post('/request', sendFriendRequest);
router.put('/accept/:requestId', acceptFriendRequest);
router.get('/', getFriends);
router.get('/requests', getFriendRequests);
router.get('/search', searchUsers);
router.get('/all', getAllUsers); // For testing - get all users (must be before /:requestId)
router.delete('/:requestId', removeFriend);

module.exports = router;
