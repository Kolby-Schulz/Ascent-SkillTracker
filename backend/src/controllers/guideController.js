const Guide = require('../models/Guide');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc    Create a guide
 * @route   POST /api/v1/guides
 * @access  Private
 */
exports.createGuide = async (req, res, next) => {
  try {
    req.body.uploadedBy = req.user.id;
    const guide = await Guide.create(req.body);

    const populated = await Guide.findById(guide._id)
      .populate('uploadedBy', 'username email')
      .lean();

    res.status(201).json({
      success: true,
      data: {
        guide: {
          ...populated,
          views: populated.views || 0,
          likes: populated.likedBy?.length || 0,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get guide by ID (increments view count)
 * @route   GET /api/v1/guides/:id
 * @access  Private
 */
exports.getGuide = async (req, res, next) => {
  try {
    const guide = await Guide.findById(req.params.id)
      .populate('uploadedBy', 'username email')
      .lean();

    if (!guide) {
      return next(new ErrorResponse('Guide not found', 404));
    }

    // Increment view count
    await Guide.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.status(200).json({
      success: true,
      data: {
        guide: {
          ...guide,
          views: (guide.views || 0) + 1,
          likes: guide.likedBy?.length || 0,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Like a guide
 * @route   POST /api/v1/guides/:id/like
 * @access  Private
 */
exports.likeGuide = async (req, res, next) => {
  try {
    const guide = await Guide.findById(req.params.id);

    if (!guide) {
      return next(new ErrorResponse('Guide not found', 404));
    }

    const userId = req.user.id;
    const hasLiked = guide.likedBy.some((id) => id.toString() === userId.toString());

    if (hasLiked) {
      guide.likedBy = guide.likedBy.filter((id) => id.toString() !== userId.toString());
    } else {
      guide.likedBy.push(userId);
    }

    await guide.save();

    res.status(200).json({
      success: true,
      data: {
        guide: {
          id: guide._id,
          likes: guide.likedBy.length,
          liked: !hasLiked,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    List guides (optionally filtered by skill or user)
 * @route   GET /api/v1/guides
 * @access  Private
 */
exports.listGuides = async (req, res, next) => {
  try {
    const { skillId, uploadedBy } = req.query;
    const query = {};

    if (skillId) query.skillId = skillId;
    if (uploadedBy) query.uploadedBy = uploadedBy;

    const guides = await Guide.find(query)
      .populate('uploadedBy', 'username email')
      .sort({ createdAt: -1 })
      .lean();

    const formatted = guides.map((g) => ({
      ...g,
      views: g.views || 0,
      likes: g.likedBy?.length || 0,
    }));

    res.status(200).json({
      success: true,
      data: { guides: formatted },
    });
  } catch (error) {
    next(error);
  }
};
