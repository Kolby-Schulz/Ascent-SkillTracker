const Roadmap = require('../models/Roadmap');
const ErrorResponse = require('../utils/errorResponse');
const { validationResult } = require('express-validator');

/**
 * @desc    Create a new roadmap
 * @route   POST /api/roadmaps
 * @access  Private
 */
exports.createRoadmap = async (req, res, next) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { name, description, subSkills, status, category, tags, visibility } = req.body;

    // Create roadmap with creator from authenticated user
    const roadmap = await Roadmap.create({
      name,
      description,
      subSkills,
      status: status || 'draft',
      category,
      tags,
      visibility: visibility || 'public',
      creator: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: roadmap,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all roadmaps (with filters)
 * @route   GET /api/roadmaps
 * @access  Public
 */
exports.getRoadmaps = async (req, res, next) => {
  try {
    const { status, creator, category, search, tag } = req.query;
    
    const filter = {};
    
    // Filter by status
    if (status) {
      filter.status = status;
    } else {
      // By default, only show published roadmaps for public access
      filter.status = 'published';
      filter.visibility = { $in: ['public', 'unlisted'] };
    }
    
    // Filter by creator
    if (creator) {
      filter.creator = creator;
    }
    
    // Filter by category
    if (category) {
      filter.category = category;
    }
    
    // Filter by tag (roadmap must have this tag in its tags array)
    if (tag && String(tag).trim()) {
      filter.tags = String(tag).trim();
    }
    
    // Search in name and description
    if (search) {
      filter.$text = { $search: search };
    }

    const roadmaps = await Roadmap.find(filter)
      .populate('creator', 'username email')
      .sort({ createdAt: -1 })
      .lean();

    const userId = req.user?._id?.toString();
    const data = roadmaps.map((r) => ({
      ...r,
      likesCount: r.likedBy?.length ?? 0,
      isLiked: userId && (r.likedBy || []).some((id) => id.toString() === userId),
    }));

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's own roadmaps
 * @route   GET /api/roadmaps/my-roadmaps
 * @access  Private
 */
exports.getMyRoadmaps = async (req, res, next) => {
  try {
    const { status } = req.query;
    
    const filter = { creator: req.user._id };
    
    if (status) {
      filter.status = status;
    }

    const roadmaps = await Roadmap.find(filter).sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: roadmaps.length,
      data: roadmaps,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single roadmap by ID
 * @route   GET /api/roadmaps/:id
 * @access  Public
 */
exports.getRoadmapById = async (req, res, next) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id)
      .populate('creator', 'username email')
      .lean();

    if (!roadmap) {
      return next(new ErrorResponse('Roadmap not found', 404));
    }

    // Check if user has access (published/public or owner)
    if (roadmap.status === 'draft' || roadmap.visibility === 'private') {
      if (!req.user || roadmap.creator._id.toString() !== req.user._id.toString()) {
        return next(new ErrorResponse('Not authorized to access this roadmap', 403));
      }
    }

    const userId = req.user?._id?.toString();
    const responseData = {
      ...roadmap,
      likesCount: roadmap.likedBy?.length ?? 0,
      isLiked: userId && (roadmap.likedBy || []).some((id) => id.toString() === userId),
    };

    res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Like or unlike a roadmap
 * @route   PUT /api/v1/roadmaps/:id/like
 * @access  Private
 */
exports.toggleLike = async (req, res, next) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);

    if (!roadmap) {
      return next(new ErrorResponse('Roadmap not found', 404));
    }

    const userId = req.user._id;
    const likedBy = roadmap.likedBy || [];
    const hasLiked = likedBy.some((id) => id.toString() === userId.toString());

    if (hasLiked) {
      roadmap.likedBy = likedBy.filter((id) => id.toString() !== userId.toString());
    } else {
      roadmap.likedBy = [...likedBy, userId];
    }
    await roadmap.save();

    res.status(200).json({
      success: true,
      data: {
        likesCount: roadmap.likedBy.length,
        liked: !hasLiked,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update roadmap
 * @route   PUT /api/roadmaps/:id
 * @access  Private (owner only)
 */
exports.updateRoadmap = async (req, res, next) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        errors: errors.array(),
      });
    }

    let roadmap = await Roadmap.findById(req.params.id);

    if (!roadmap) {
      return next(new ErrorResponse('Roadmap not found', 404));
    }

    // Check ownership
    if (roadmap.creator.toString() !== req.user._id.toString()) {
      return next(new ErrorResponse('Not authorized to update this roadmap', 403));
    }

    const { name, description, subSkills, status, category, tags, visibility } = req.body;

    roadmap = await Roadmap.findByIdAndUpdate(
      req.params.id,
      { name, description, subSkills, status, category, tags, visibility },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: roadmap,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete roadmap
 * @route   DELETE /api/roadmaps/:id
 * @access  Private (owner only)
 */
exports.deleteRoadmap = async (req, res, next) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);

    if (!roadmap) {
      return next(new ErrorResponse('Roadmap not found', 404));
    }

    // Check ownership
    if (roadmap.creator.toString() !== req.user._id.toString()) {
      return next(new ErrorResponse('Not authorized to delete this roadmap', 403));
    }

    await roadmap.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: 'Roadmap deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Publish a draft roadmap
 * @route   PUT /api/roadmaps/:id/publish
 * @access  Private (owner only)
 */
exports.publishRoadmap = async (req, res, next) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);

    if (!roadmap) {
      return next(new ErrorResponse('Roadmap not found', 404));
    }

    // Check ownership
    if (roadmap.creator.toString() !== req.user._id.toString()) {
      return next(new ErrorResponse('Not authorized to publish this roadmap', 403));
    }

    roadmap.status = 'published';
    await roadmap.save();

    res.status(200).json({
      success: true,
      data: roadmap,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Unpublish a roadmap (revert to draft)
 * @route   PUT /api/roadmaps/:id/unpublish
 * @access  Private (owner only)
 */
exports.unpublishRoadmap = async (req, res, next) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);

    if (!roadmap) {
      return next(new ErrorResponse('Roadmap not found', 404));
    }

    // Check ownership
    if (roadmap.creator.toString() !== req.user._id.toString()) {
      return next(new ErrorResponse('Not authorized to unpublish this roadmap', 403));
    }

    roadmap.status = 'draft';
    await roadmap.save();

    res.status(200).json({
      success: true,
      data: roadmap,
    });
  } catch (error) {
    next(error);
  }
};
