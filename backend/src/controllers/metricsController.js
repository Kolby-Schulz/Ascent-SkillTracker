const Guide = require('../models/Guide');
const UserSkillProgress = require('../models/UserSkillProgress');

/**
 * @desc    Get current user's metrics
 * @route   GET /api/v1/metrics
 * @access  Private
 */
exports.getMyMetrics = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;

    // Skills learned and in progress
    const progressList = await UserSkillProgress.find({ userId }).lean();
    const skillsLearned = progressList.filter((p) => p.status === 'learned').length;
    const skillsInProgress = progressList.filter((p) => p.status === 'in_progress').length;

    // Guides uploaded by user
    const myGuides = await Guide.find({ uploadedBy: userId })
      .populate('uploadedBy', 'username email')
      .lean();

    const guidesUploaded = myGuides.length;

    // Total views across all guides uploaded by user
    const totalGuideViews = myGuides.reduce((sum, g) => sum + (g.views || 0), 0);

    // Total likes across all guides uploaded by user
    const totalGuideLikes = myGuides.reduce((sum, g) => sum + (g.likedBy?.length || 0), 0);

    // Per-guide breakdown: title, skill, views, likes, uploader
    const guideBreakdown = myGuides.map((g) => ({
      id: g._id,
      title: g.title,
      skillName: g.skillName || g.skillId,
      views: g.views || 0,
      likes: g.likedBy?.length || 0,
      uploadedBy: g.uploadedBy?.username || 'Unknown',
    }));

    res.status(200).json({
      success: true,
      data: {
        metrics: {
          skillsLearned,
          skillsInProgress,
          guidesUploaded,
          totalGuideViews,
          totalGuideLikes,
        },
        guideBreakdown,
      },
    });
  } catch (error) {
    next(error);
  }
};
