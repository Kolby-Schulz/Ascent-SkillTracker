const SkillCompletion = require('../models/SkillCompletion');
const StepProgress = require('../models/StepProgress');
const UserSkillProgress = require('../models/UserSkillProgress');
const Roadmap = require('../models/Roadmap');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc    Get user analytics dashboard data
 * @route   GET /api/v1/analytics
 * @access  Private
 */
exports.getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get all skill completions for the user
    const completions = await SkillCompletion.find({ userId })
      .sort({ completedAt: -1 })
      .lean();

    // Get all step progress to calculate time spent
    const stepProgress = await StepProgress.find({ userId }).lean();

    // Get all in-progress skills
    const inProgressSkills = await UserSkillProgress.find({
      userId,
      status: 'in_progress',
    }).lean();

    // Calculate time spent per skill
    const timeSpentPerSkill = {};
    stepProgress.forEach((step) => {
      if (step.completedAt && step.startedAt) {
        const timeSpent = step.completedAt - step.startedAt;
        const roadmapId = step.roadmapId.toString();
        if (!timeSpentPerSkill[roadmapId]) {
          timeSpentPerSkill[roadmapId] = {
            totalTime: 0,
            stepCount: 0,
            roadmapId: roadmapId,
          };
        }
        timeSpentPerSkill[roadmapId].totalTime += timeSpent;
        timeSpentPerSkill[roadmapId].stepCount += 1;
      }
    });

    // Get roadmap names for time spent
    const roadmapIds = Object.keys(timeSpentPerSkill);
    const roadmaps = await Roadmap.find({
      _id: { $in: roadmapIds },
    }).select('name').lean();

    const roadmapMap = {};
    roadmaps.forEach((r) => {
      roadmapMap[r._id.toString()] = r.name;
    });

    const timeSpentData = Object.entries(timeSpentPerSkill).map(([id, data]) => ({
      skillName: roadmapMap[id] || 'Unknown',
      totalHours: Math.round((data.totalTime / (1000 * 60 * 60)) * 10) / 10,
      totalMinutes: Math.round(data.totalTime / (1000 * 60)),
      stepCount: data.stepCount,
    }));

    // Calculate learning velocity (completions per month)
    const velocityData = {};
    completions.forEach((completion) => {
      const date = new Date(completion.completedAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!velocityData[monthKey]) {
        velocityData[monthKey] = 0;
      }
      velocityData[monthKey]++;
    });

    const velocityChart = Object.entries(velocityData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({
        month,
        completions: count,
      }));

    // Calculate completion trends (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentCompletions = completions.filter(
      (c) => new Date(c.completedAt) >= thirtyDaysAgo
    );

    const dailyCompletions = {};
    recentCompletions.forEach((completion) => {
      const date = new Date(completion.completedAt);
      const dayKey = date.toISOString().split('T')[0];
      if (!dailyCompletions[dayKey]) {
        dailyCompletions[dayKey] = 0;
      }
      dailyCompletions[dayKey]++;
    });

    // Fill in missing days with 0
    const trendChart = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayKey = date.toISOString().split('T')[0];
      trendChart.push({
        date: dayKey,
        completions: dailyCompletions[dayKey] || 0,
      });
    }

    // Calculate personalized insights
    const totalCompleted = completions.length;
    const totalInProgress = inProgressSkills.length;
    const averageDaysToComplete =
      completions.length > 0
        ? Math.round(
            completions.reduce((sum, c) => sum + c.daysToComplete, 0) /
              completions.length
          )
        : 0;

    const totalTimeSpentHours = timeSpentData.reduce(
      (sum, skill) => sum + skill.totalHours,
      0
    );

    // Find fastest and slowest completions
    const fastestCompletion = completions.length > 0
      ? completions.reduce((min, c) =>
          c.daysToComplete < min.daysToComplete ? c : min
        )
      : null;

    const slowestCompletion = completions.length > 0
      ? completions.reduce((max, c) =>
          c.daysToComplete > max.daysToComplete ? c : max
        )
      : null;

    // Most active category
    const categoryCounts = {};
    completions.forEach((c) => {
      if (c.category) {
        categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
      }
    });
    const topCategory = Object.entries(categoryCounts).sort(
      ([, a], [, b]) => b - a
    )[0];

    const insights = {
      totalCompleted,
      totalInProgress,
      averageDaysToComplete,
      totalTimeSpentHours: Math.round(totalTimeSpentHours * 10) / 10,
      fastestSkill: fastestCompletion
        ? {
            name: fastestCompletion.roadmapName,
            days: fastestCompletion.daysToComplete,
          }
        : null,
      slowestSkill: slowestCompletion
        ? {
            name: slowestCompletion.roadmapName,
            days: slowestCompletion.daysToComplete,
          }
        : null,
      topCategory: topCategory
        ? { name: topCategory[0], count: topCategory[1] }
        : null,
      currentStreak: 0, // TODO: Calculate from daily activity
    };

    res.status(200).json({
      success: true,
      data: {
        timeSpentPerSkill: timeSpentData.sort((a, b) => b.totalHours - a.totalHours),
        velocityChart,
        trendChart,
        insights,
      },
    });
  } catch (error) {
    next(error);
  }
};
