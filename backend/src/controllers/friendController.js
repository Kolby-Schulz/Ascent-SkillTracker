const Friend = require('../models/Friend');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc    Send friend request
 * @route   POST /api/v1/friends/request
 * @access  Private
 */
exports.sendFriendRequest = async (req, res, next) => {
  try {
    const { recipientId } = req.body;
    const requesterId = req.user.id;

    if (!recipientId) {
      return next(new ErrorResponse('Recipient ID is required', 400));
    }

    if (requesterId === recipientId) {
      return next(new ErrorResponse('Cannot send friend request to yourself', 400));
    }

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Check if relationship already exists
    const existingRelationship = await Friend.findOne({
      $or: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId },
      ],
    });

    if (existingRelationship) {
      if (existingRelationship.status === 'accepted') {
        return next(new ErrorResponse('Already friends', 400));
      }
      if (existingRelationship.status === 'pending') {
        return next(new ErrorResponse('Friend request already sent', 400));
      }
      if (existingRelationship.status === 'blocked') {
        return next(new ErrorResponse('Cannot send friend request', 400));
      }
    }

    // Create friend request
    const friendRequest = await Friend.create({
      requester: requesterId,
      recipient: recipientId,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      data: { friendRequest },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Accept friend request
 * @route   PUT /api/v1/friends/accept/:requestId
 * @access  Private
 */
exports.acceptFriendRequest = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.id;

    const friendRequest = await Friend.findById(requestId);

    if (!friendRequest) {
      return next(new ErrorResponse('Friend request not found', 404));
    }

    if (friendRequest.recipient.toString() !== userId) {
      return next(new ErrorResponse('Not authorized to accept this request', 403));
    }

    if (friendRequest.status !== 'pending') {
      return next(new ErrorResponse('Friend request is not pending', 400));
    }

    friendRequest.status = 'accepted';
    await friendRequest.save();

    res.status(200).json({
      success: true,
      data: { friendRequest },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reject/Remove friend request
 * @route   DELETE /api/v1/friends/:requestId
 * @access  Private
 */
exports.removeFriend = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.id;

    const friendRequest = await Friend.findById(requestId);

    if (!friendRequest) {
      return next(new ErrorResponse('Friend request not found', 404));
    }

    // Check if user is part of this relationship
    if (
      friendRequest.requester.toString() !== userId &&
      friendRequest.recipient.toString() !== userId
    ) {
      return next(new ErrorResponse('Not authorized', 403));
    }

    await friendRequest.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's friends
 * @route   GET /api/v1/friends
 * @access  Private
 */
exports.getFriends = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const friendships = await Friend.find({
      $or: [{ requester: userId }, { recipient: userId }],
      status: 'accepted',
    })
      .populate('requester', 'username email profilePicture')
      .populate('recipient', 'username email profilePicture')
      .sort({ createdAt: -1 });

    const friends = friendships.map((friendship) => {
      const friend =
        friendship.requester._id.toString() === userId
          ? friendship.recipient
          : friendship.requester;
      return {
        id: friend._id,
        username: friend.username,
        email: friend.email,
        profilePicture: friend.profilePicture,
        friendshipId: friendship._id,
      };
    });

    res.status(200).json({
      success: true,
      data: { friends },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get pending friend requests
 * @route   GET /api/v1/friends/requests
 * @access  Private
 */
exports.getFriendRequests = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const requests = await Friend.find({
      recipient: userId,
      status: 'pending',
    })
      .populate('requester', 'username email profilePicture')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        requests: requests.map((req) => ({
          id: req._id,
          requester: {
            id: req.requester._id,
            username: req.requester.username,
            email: req.requester.email,
            profilePicture: req.requester.profilePicture,
          },
          createdAt: req.createdAt,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Search users
 * @route   GET /api/v1/friends/search?q=username
 * @access  Private
 */
exports.searchUsers = async (req, res, next) => {
  try {
    const { q } = req.query;
    const userId = req.user.id;

    if (!q || q.length < 2) {
      return next(new ErrorResponse('Search query must be at least 2 characters', 400));
    }

    // Find users matching the search query
    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
      ],
      _id: { $ne: userId }, // Exclude current user
    })
      .select('username email profilePicture privacy')
      .limit(20);

    // Get existing friend relationships
    const friendships = await Friend.find({
      $or: [{ requester: userId }, { recipient: userId }],
    });

    const friendshipMap = new Map();
    friendships.forEach((friendship) => {
      const otherUserId =
        friendship.requester.toString() === userId
          ? friendship.recipient.toString()
          : friendship.requester.toString();
      friendshipMap.set(otherUserId, friendship.status);
    });

    const results = users.map((user) => ({
      id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      privacy: user.privacy,
      relationshipStatus: friendshipMap.get(user._id.toString()) || null,
    }));

    res.status(200).json({
      success: true,
      data: { users: results },
    });
  } catch (error) {
    next(error);
  }
};
