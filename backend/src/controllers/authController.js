const { validationResult } = require('express-validator');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const { generateToken } = require('../utils/jwt');

/**
 * @desc    Register user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
exports.register = async (req, res, next) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorResponse(errors.array()[0].msg, 400));
  }

  const { username, email, password } = req.body;

  try {
    // Check if user already exists (username or email)
    const userExists = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (userExists) {
      if (userExists.username === username) {
        return next(new ErrorResponse('Username already taken', 400));
      }
      return next(new ErrorResponse('Email already registered', 400));
    }

    // Create user
    const user = await User.create({
      username,
      email,
      passwordHash: password, // Will be hashed by pre-save hook
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          roles: user.roles,
          privacy: user.privacy,
          bio: user.bio,
          profilePicture: user.profilePicture,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
exports.login = async (req, res, next) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorResponse(errors.array()[0].msg, 400));
  }

  const { username, password } = req.body;

  try {
    // Check for user by username (include password for comparison)
    const user = await User.findOne({ username }).select('+passwordHash');

    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          roles: user.roles,
          privacy: user.privacy,
          bio: user.bio,
          profilePicture: user.profilePicture,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          roles: user.roles,
          privacy: user.privacy,
          bio: user.bio,
          profilePicture: user.profilePicture,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user profile by ID
 * @route   GET /api/v1/auth/user/:userId
 * @access  Private
 */
exports.getUserProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    const targetUser = await User.findById(userId).select('-passwordHash');
    
    if (!targetUser) {
      return next(new ErrorResponse('User not found', 404));
    }

    // If viewing own profile, return full data
    if (userId === currentUserId) {
      return res.status(200).json({
        success: true,
        data: {
          user: {
            id: targetUser._id,
            username: targetUser.username,
            email: targetUser.email,
            roles: targetUser.roles,
            privacy: targetUser.privacy,
            bio: targetUser.bio,
            profilePicture: targetUser.profilePicture,
            createdAt: targetUser.createdAt,
          },
        },
      });
    }

    // Check if user can view profile (must be friends or public profile)
    const Friend = require('../models/Friend');
    const friendship = await Friend.findOne({
      $or: [
        { requester: currentUserId, recipient: userId, status: 'accepted' },
        { requester: userId, recipient: currentUserId, status: 'accepted' },
      ],
    });

    if (!friendship && targetUser.privacy === 'private') {
      return next(new ErrorResponse('This profile is private', 403));
    }

    // Return public profile data
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: targetUser._id,
          username: targetUser.username,
          privacy: targetUser.privacy,
          bio: targetUser.bio,
          profilePicture: targetUser.profilePicture,
          createdAt: targetUser.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/v1/auth/profile
 * @access  Private
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { privacy, bio, profilePicture } = req.body;
    const userId = req.user.id;

    const updateData = {};
    if (privacy !== undefined) {
      if (!['public', 'private'].includes(privacy)) {
        return next(new ErrorResponse('Privacy must be "public" or "private"', 400));
      }
      updateData.privacy = privacy;
    }
    if (bio !== undefined) {
      updateData.bio = bio;
    }
    if (profilePicture !== undefined) {
      updateData.profilePicture = profilePicture;
    }

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          roles: user.roles,
          privacy: user.privacy,
          bio: user.bio,
          profilePicture: user.profilePicture,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
