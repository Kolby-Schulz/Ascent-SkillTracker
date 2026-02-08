const Post = require('../models/Post');
const Roadmap = require('../models/Roadmap');
const Friend = require('../models/Friend');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc    Create a post (share roadmap)
 * @route   POST /api/v1/posts
 * @access  Private
 */
exports.createPost = async (req, res, next) => {
  try {
    const { roadmapId, caption } = req.body;
    const userId = req.user.id;

    if (!roadmapId) {
      return next(new ErrorResponse('Roadmap ID is required', 400));
    }

    // Verify roadmap exists and belongs to user
    const roadmap = await Roadmap.findById(roadmapId);
    if (!roadmap) {
      return next(new ErrorResponse('Roadmap not found', 404));
    }

    if (roadmap.creator.toString() !== userId) {
      return next(new ErrorResponse('Not authorized to share this roadmap', 403));
    }

    if (roadmap.status !== 'published') {
      return next(new ErrorResponse('Only published roadmaps can be shared', 400));
    }

    // Create post
    const post = await Post.create({
      author: userId,
      roadmap: roadmapId,
      caption: caption || '',
    });

    await post.populate('author', 'username profilePicture');
    await post.populate('roadmap', 'name description subSkillCount');

    res.status(201).json({
      success: true,
      data: { post },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get feed posts (from friends and public posts)
 * @route   GET /api/v1/posts/feed
 * @access  Private
 */
exports.getFeed = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    // Get user's friends
    const friendships = await Friend.find({
      $or: [{ requester: userId }, { recipient: userId }],
      status: 'accepted',
    });

    const friendIds = friendships.map((friendship) =>
      friendship.requester.toString() === userId
        ? friendship.recipient.toString()
        : friendship.requester.toString()
    );

    // Get posts from friends and public posts
    const posts = await Post.find({
      $or: [
        { author: { $in: friendIds } },
        { author: userId }, // Include own posts
      ],
    })
      .populate('author', 'username profilePicture')
      .populate('roadmap', 'name description subSkillCount category')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Check if user has liked each post
    const postsWithLikes = posts.map((post) => {
      const isLiked = post.likes.some((likeId) => likeId.toString() === userId);
      return {
        id: post._id,
        author: post.author,
        roadmap: post.roadmap,
        caption: post.caption,
        likesCount: post.likesCount,
        isLiked,
        createdAt: post.createdAt,
      };
    });

    res.status(200).json({
      success: true,
      data: { posts: postsWithLikes },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Like/Unlike a post
 * @route   PUT /api/v1/posts/:postId/like
 * @access  Private
 */
exports.toggleLike = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return next(new ErrorResponse('Post not found', 404));
    }

    const likeIndex = post.likes.findIndex((likeId) => likeId.toString() === userId);

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({
      success: true,
      data: {
        isLiked: likeIndex === -1,
        likesCount: post.likesCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's posts
 * @route   GET /api/v1/posts/user/:userId
 * @access  Private
 */
exports.getUserPosts = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    // Check if user can view posts (must be friends or public profile)
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return next(new ErrorResponse('User not found', 404));
    }

    // If viewing own posts, allow
    if (userId === currentUserId) {
      const posts = await Post.find({ author: userId })
        .populate('author', 'username profilePicture')
        .populate('roadmap', 'name description subSkillCount')
        .sort({ createdAt: -1 });

      const postsWithLikes = posts.map((post) => ({
        id: post._id,
        author: post.author,
        roadmap: post.roadmap,
        caption: post.caption,
        likesCount: post.likesCount,
        isLiked: post.likes.some((likeId) => likeId.toString() === currentUserId),
        createdAt: post.createdAt,
      }));

      return res.status(200).json({
        success: true,
        data: { posts: postsWithLikes },
      });
    }

    // Check if friends
    const friendship = await Friend.findOne({
      $or: [
        { requester: currentUserId, recipient: userId },
        { requester: userId, recipient: currentUserId },
      ],
      status: 'accepted',
    });

    if (!friendship && targetUser.privacy === 'private') {
      return next(new ErrorResponse('Not authorized to view posts', 403));
    }

    const posts = await Post.find({ author: userId })
      .populate('author', 'username profilePicture')
      .populate('roadmap', 'name description subSkillCount')
      .sort({ createdAt: -1 });

    const postsWithLikes = posts.map((post) => ({
      id: post._id,
      author: post.author,
      roadmap: post.roadmap,
      caption: post.caption,
      likesCount: post.likesCount,
      isLiked: post.likes.some((likeId) => likeId.toString() === currentUserId),
      createdAt: post.createdAt,
    }));

    res.status(200).json({
      success: true,
      data: { posts: postsWithLikes },
    });
  } catch (error) {
    next(error);
  }
};
