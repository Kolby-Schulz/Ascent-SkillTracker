const StepProgress = require('../models/StepProgress');
const Friend = require('../models/Friend');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc    Track step start
 * @route   POST /api/v1/progress/start
 * @access  Private
 */
exports.startStep = async (req, res, next) => {
  try {
    const { roadmapId, stepIndex } = req.body;
    const userId = req.user.id;

    if (!roadmapId || stepIndex === undefined) {
      return next(new ErrorResponse('Roadmap ID and step index are required', 400));
    }

    // Find or create step progress
    let stepProgress = await StepProgress.findOne({
      userId,
      roadmapId,
      stepIndex,
    });

    if (stepProgress) {
      // If already started but not completed, update startedAt
      if (!stepProgress.isCompleted) {
        stepProgress.startedAt = new Date();
        await stepProgress.save();
      }
    } else {
      // Create new step progress
      stepProgress = await StepProgress.create({
        userId,
        roadmapId,
        stepIndex,
        startedAt: new Date(),
      });
    }

    res.status(200).json({
      success: true,
      data: { stepProgress },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Track step completion
 * @route   POST /api/v1/progress/complete
 * @access  Private
 */
exports.completeStep = async (req, res, next) => {
  try {
    const { roadmapId, stepIndex } = req.body;
    const userId = req.user.id;

    if (!roadmapId || stepIndex === undefined) {
      return next(new ErrorResponse('Roadmap ID and step index are required', 400));
    }

    // Find or create step progress
    let stepProgress = await StepProgress.findOne({
      userId,
      roadmapId,
      stepIndex,
    });

    if (stepProgress) {
      stepProgress.isCompleted = true;
      stepProgress.completedAt = new Date();
      await stepProgress.save();
    } else {
      // Create new step progress with completion
      stepProgress = await StepProgress.create({
        userId,
        roadmapId,
        stepIndex,
        startedAt: new Date(),
        completedAt: new Date(),
        isCompleted: true,
      });
    }

    res.status(200).json({
      success: true,
      data: { stepProgress },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get friend progress for a roadmap
 * @route   GET /api/v1/progress/friends/:roadmapId
 * @access  Private
 */
exports.getFriendProgress = async (req, res, next) => {
  try {
    const { roadmapId } = req.params;
    const userId = req.user.id;

    // Get user's friends
    const friendships = await Friend.find({
      $or: [{ requester: userId }, { recipient: userId }],
      status: 'accepted',
    })
      .populate('requester', 'username')
      .populate('recipient', 'username');

    const friendIds = friendships.map((friendship) => {
      return friendship.requester._id.toString() === userId
        ? friendship.recipient._id
        : friendship.requester._id;
    });

    if (friendIds.length === 0) {
      return res.status(200).json({
        success: true,
        data: { friendProgress: [] },
      });
    }

    // Get step progress for all friends on this roadmap
    const friendProgressData = await StepProgress.find({
      userId: { $in: friendIds },
      roadmapId,
    })
      .populate('userId', 'username')
      .sort({ stepIndex: 1, completedAt: -1 });

    // Group by friend and get their latest position
    const friendProgressMap = new Map();

    friendProgressData.forEach((progress) => {
      const friendId = progress.userId._id.toString();
      const friendUsername = progress.userId.username;

      if (!friendProgressMap.has(friendId)) {
        friendProgressMap.set(friendId, {
          userId: friendId,
          username: friendUsername,
          steps: [],
        });
      }

      const friendData = friendProgressMap.get(friendId);
      friendData.steps.push({
        stepIndex: progress.stepIndex,
        startedAt: progress.startedAt,
        completedAt: progress.completedAt,
        isCompleted: progress.isCompleted,
      });
    });

    // Convert to array and calculate current position for each friend
    const friendProgress = Array.from(friendProgressMap.values()).map((friend) => {
      // Find the highest completed step, or the current step being worked on
      const completedSteps = friend.steps.filter((s) => s.isCompleted);
      const inProgressSteps = friend.steps.filter((s) => !s.isCompleted && s.startedAt);

      let currentStepIndex = -1;
      let lastActivity = null;

      if (completedSteps.length > 0) {
        const highestCompleted = Math.max(...completedSteps.map((s) => s.stepIndex));
        currentStepIndex = highestCompleted;
        lastActivity = completedSteps.find((s) => s.stepIndex === highestCompleted)?.completedAt;
      } else if (inProgressSteps.length > 0) {
        const currentStep = inProgressSteps[0];
        currentStepIndex = currentStep.stepIndex;
        lastActivity = currentStep.startedAt;
      }

      return {
        userId: friend.userId,
        username: friend.username,
        currentStepIndex,
        lastActivity,
        totalCompleted: completedSteps.length,
      };
    });

    res.status(200).json({
      success: true,
      data: { friendProgress },
    });
  } catch (error) {
    next(error);
  }
};
