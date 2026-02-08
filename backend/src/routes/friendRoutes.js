const express = require('express');
const { protect } = require('../middlewares/auth');
const {
  sendFriendRequest,
  acceptFriendRequest,
  removeFriend,
  getFriends,
  getFriendRequests,
  searchUsers,
} = require('../controllers/friendController');

const router = express.Router();

router.use(protect); // All routes require authentication

router.post('/request', sendFriendRequest);
router.put('/accept/:requestId', acceptFriendRequest);
router.delete('/:requestId', removeFriend);
router.get('/', getFriends);
router.get('/requests', getFriendRequests);
router.get('/search', searchUsers);

module.exports = router;
