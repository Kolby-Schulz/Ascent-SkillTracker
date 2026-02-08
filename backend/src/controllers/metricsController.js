const Guide = require('../models/Guide');
const Roadmap = require('../models/Roadmap');
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

    // Roadmaps (guides) created by user — same count as Profile "my roadmaps"
    const myRoadmaps = await Roadmap.find({ creator: userId }).lean();
    const guidesUploaded = myRoadmaps.length;

    // Guides (legacy/other) uploaded by user — for views/likes breakdown
    const myGuides = await Guide.find({ uploadedBy: userId })
      .populate('uploadedBy', 'username email')
      .lean();

    // Total views across all guides uploaded by user
    const totalGuideViews = myGuides.reduce((sum, g) => sum + (g.views || 0), 0);

    // Total likes across all guides uploaded by user
    const totalGuideLikes = myGuides.reduce((sum, g) => sum + (g.likedBy?.length || 0), 0);

    // Total likes on user's roadmaps (guides)
    const totalRoadmapLikes = myRoadmaps.reduce((sum, r) => sum + (r.likedBy?.length || 0), 0);

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
          totalRoadmapLikes,
          totalLikes: totalGuideLikes + totalRoadmapLikes,
        },
        guideBreakdown,
      },
    });
  } catch (error) {
    next(error);
  }
};
