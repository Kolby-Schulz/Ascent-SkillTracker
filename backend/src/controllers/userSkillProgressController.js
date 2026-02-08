const UserSkillProgress = require('../models/UserSkillProgress');
const User = require('../models/User');
const Friend = require('../models/Friend');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc    Add or update user skill progress
 * @route   POST /api/v1/user-skills
 * @access  Private
 */
exports.upsertSkillProgress = async (req, res, next) => {
  try {
    const { skillName, status } = req.body;
    const userId = req.user.id;

    if (!skillName || !status) {
      return next(new ErrorResponse('skillName and status are required', 400));
    }

    if (!['learned', 'in_progress'].includes(status)) {
      return next(new ErrorResponse('status must be "learned" or "in_progress"', 400));
    }

    const progress = await UserSkillProgress.findOneAndUpdate(
      { userId, skillName: skillName.trim() },
      { status },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      data: {
        progress: {
          id: progress._id,
          skillName: progress.skillName,
          status: progress.status,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove current user's skill progress (so they no longer appear on friends' cards)
 * @route   DELETE /api/v1/user-skills?skillName=Guitar
 * @access  Private
 */
exports.deleteSkillProgress = async (req, res, next) => {
  try {
    const { skillName } = req.query;
    const userId = req.user.id;

    if (!skillName || typeof skillName !== 'string' || !skillName.trim()) {
      return next(new ErrorResponse('skillName query is required', 400));
    }

    const name = skillName.trim();
    await UserSkillProgress.deleteOne({ userId, skillName: name });

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user's skill progress
 * @route   GET /api/v1/user-skills
 * @access  Private
 */
exports.getMyProgress = async (req, res, next) => {
  try {
    const progressList = await UserSkillProgress.find({ userId: req.user.id }).lean();

    res.status(200).json({
      success: true,
      data: {
        progress: progressList.map((p) => ({
          id: p._id,
          skillName: p.skillName,
          status: p.status,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get friends (only) who are learning the same skill by name. Non-friends are not shown.
 * @route   GET /api/v1/user-skills/learning?skillName=Guitar
 * @access  Private
 */
exports.getUsersLearningSkill = async (req, res, next) => {
  try {
    const { skillName } = req.query;
    const currentUserId = req.user.id;

    if (!skillName || typeof skillName !== 'string' || !skillName.trim()) {
      return next(new ErrorResponse('skillName query is required', 400));
    }

    const name = skillName.trim();

    // Only show friends: get accepted friend IDs
    const friendships = await Friend.find({
      $or: [{ requester: currentUserId }, { recipient: currentUserId }],
      status: 'accepted',
    })
      .populate('requester', '_id')
      .populate('recipient', '_id');

    const friendIds = friendships.map((friendship) => {
      return friendship.requester._id.toString() === currentUserId
        ? friendship.recipient._id
        : friendship.requester._id;
    });

    if (friendIds.length === 0) {
      return res.status(200).json({
        success: true,
        data: { users: [] },
      });
    }

    const progressList = await UserSkillProgress.find({
      skillName: { $regex: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
      userId: { $in: friendIds },
      status: 'in_progress',
    })
      .populate('userId', 'username profilePicture')
      .limit(50)
      .lean();

    const users = progressList.map((p) => ({
      userId: p.userId._id,
      username: p.userId.username,
      profilePicture: p.userId.profilePicture,
    }));

    res.status(200).json({
      success: true,
      data: { users },
    });
  } catch (error) {
    next(error);
  }
};
