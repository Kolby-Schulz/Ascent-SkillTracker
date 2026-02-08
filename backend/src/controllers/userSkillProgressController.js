const UserSkillProgress = require('../models/UserSkillProgress');
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
