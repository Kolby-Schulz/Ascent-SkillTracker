const SkillCompletion = require('../models/SkillCompletion');
const Roadmap = require('../models/Roadmap');
const User = require('../models/User');
const Friend = require('../models/Friend');
const ErrorResponse = require('../utils/errorResponse');

/**
 * Calculate leaderboard rankings
 * @param {Array} completions - Array of completion documents
 * @returns {Array} Sorted array with rankings
 */
function calculateRankings(completions) {
  // Group by userId
  const userStats = {};
  
  completions.forEach(completion => {
    const userId = completion.userId?._id ? completion.userId._id.toString() : completion.userId.toString();
    const userIdObj = completion.userId?._id || completion.userId;
    if (!userStats[userId]) {
      userStats[userId] = {
        userId: userIdObj,
        username: completion.user?.username || completion.userId?.username || 'Unknown',
        totalCompleted: 0,
        totalDays: 0,
        averageDays: 0,
        completions: [],
      };
    }
    
    userStats[userId].totalCompleted++;
    userStats[userId].totalDays += completion.daysToComplete;
    userStats[userId].completions.push(completion);
  });
  
  // Calculate averages and convert to array
  const rankings = Object.values(userStats).map(user => ({
    ...user,
    averageDays: user.totalDays / user.totalCompleted,
  }));
  
  // Sort by total completed (desc), then by average days (asc - faster is better)
  rankings.sort((a, b) => {
    if (b.totalCompleted !== a.totalCompleted) {
      return b.totalCompleted - a.totalCompleted;
    }
    return a.averageDays - b.averageDays;
  });
  
  // Add rank numbers
  rankings.forEach((user, index) => {
    user.rank = index + 1;
  });
  
  return rankings;
}

/**
 * @desc    Get leaderboard (friends or all users)
 * @route   GET /api/v1/leaderboard
 * @access  Private
 */
exports.getLeaderboard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { scope = 'all', category, tag } = req.query;
    
    // Build query
    let query = {};
    
    // Filter by category or tag
    if (category) {
      query.category = category;
    }
    if (tag) {
      query.tags = { $in: [tag] }; // Tags is an array, use $in
    }
    
    // Get user IDs based on scope
    let userIds = null;
    if (scope === 'friends') {
      // Get accepted friendships
      const friendships = await Friend.find({
        $or: [
          { requester: userId, status: 'accepted' },
          { recipient: userId, status: 'accepted' },
        ],
      }).lean();
      
      // Extract friend IDs
      userIds = friendships.map(fr => 
        fr.requester.toString() === userId ? fr.recipient.toString() : fr.requester.toString()
      );
      
      // Always include current user
      userIds.push(userId.toString());
      
      query.userId = { $in: userIds };
    }
    
    // Fetch completions with user data
    const completions = await SkillCompletion.find(query)
      .populate('userId', 'username')
      .lean();
    
    // Calculate rankings
    let rankings = calculateRankings(completions);
    
    // Ensure current user is always included (even with 0 completions)
    const currentUserInRankings = rankings.some(r => {
      const rId = r.userId?._id ? r.userId._id.toString() : r.userId.toString();
      return rId === userId.toString();
    });
    
    if (!currentUserInRankings) {
      const currentUserDoc = await User.findById(userId, 'username').lean();
      if (currentUserDoc) {
        rankings.push({
          userId: currentUserDoc._id,
          username: currentUserDoc.username,
          totalCompleted: 0,
          totalDays: 0,
          averageDays: 0,
          completions: [],
        });
      }
    }
    
    // If scope is 'friends', ensure all friends (including those with 0 completions) are included
    if (scope === 'friends' && userIds) {
      const friendUsers = await User.find({ _id: { $in: userIds } }, 'username').lean();
      const existingUserIds = new Set(rankings.map(r => r.userId.toString()));
      
      friendUsers.forEach(friend => {
        const friendIdStr = friend._id.toString();
        if (!existingUserIds.has(friendIdStr)) {
          // Add user with 0 completions
          rankings.push({
            userId: friend._id,
            username: friend.username,
            totalCompleted: 0,
            totalDays: 0,
            averageDays: 0,
            completions: [],
            rank: rankings.length + 1,
          });
        }
      });
      
      // Re-sort after adding 0-completion users
      rankings.sort((a, b) => {
        if (b.totalCompleted !== a.totalCompleted) {
          return b.totalCompleted - a.totalCompleted;
        }
        return a.averageDays - b.averageDays;
      });
      
      // Re-assign ranks
      rankings.forEach((user, index) => {
        user.rank = index + 1;
      });
    }
    
    // Find current user's position
    const currentUserRanking = rankings.findIndex(
      r => {
        const rId = r.userId?._id ? r.userId._id.toString() : r.userId.toString();
        return rId === userId.toString();
      }
    );
    
    res.status(200).json({
      success: true,
      data: {
        rankings,
        currentUserIndex: currentUserRanking >= 0 ? currentUserRanking : null,
        scope,
        category: category || null,
        tag: tag || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get available categories and tags for filtering
 * @route   GET /api/v1/leaderboard/filters
 * @access  Private
 */
exports.getFilters = async (req, res, next) => {
  try {
    // Get categories and tags from both SkillCompletion and Roadmap
    const completionCategories = await SkillCompletion.distinct('category');
    const roadmapCategories = await Roadmap.distinct('category');
    
    // Get tags from completions (tags is an array, so we need to aggregate)
    const completionDocs = await SkillCompletion.find({}, 'tags').lean();
    const completionTags = new Set();
    completionDocs.forEach(doc => {
      if (doc.tags && Array.isArray(doc.tags)) {
        doc.tags.forEach(tag => {
          if (tag) completionTags.add(tag);
        });
      }
    });
    
    // Get tags from roadmaps
    const roadmapDocs = await Roadmap.find({}, 'tags').lean();
    const roadmapTags = new Set();
    roadmapDocs.forEach(doc => {
      if (doc.tags && Array.isArray(doc.tags)) {
        doc.tags.forEach(tag => {
          if (tag) roadmapTags.add(tag);
        });
      }
    });
    
    // Combine and deduplicate
    const allCategories = [...new Set([...completionCategories, ...roadmapCategories])].filter(c => c);
    const allTags = [...new Set([...completionTags, ...roadmapTags])].filter(t => t);
    
    res.status(200).json({
      success: true,
      data: {
        categories: allCategories.sort(),
        tags: allTags.sort(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Record a skill/roadmap completion
 * @route   POST /api/v1/leaderboard/complete
 * @access  Private
 */
exports.recordCompletion = async (req, res, next) => {
  try {
    const { roadmapId, roadmapName, category, tags, startedAt } = req.body;
    const userId = req.user.id;
    
    if (!roadmapId || !roadmapName) {
      return next(new ErrorResponse('Roadmap ID and name are required', 400));
    }
    
    // Check if already completed
    const existing = await SkillCompletion.findOne({ userId, roadmapId });
    if (existing) {
      return res.status(200).json({
        success: true,
        data: { completion: existing },
      });
    }
    
    // Calculate days to complete
    const startDate = startedAt ? new Date(startedAt) : new Date();
    const completedAt = new Date();
    const daysToComplete = Math.max(
      1,
      Math.ceil((completedAt - startDate) / (1000 * 60 * 60 * 24))
    );
    
    // Create completion record
    const completion = await SkillCompletion.create({
      userId,
      roadmapId,
      roadmapName,
      category: category || null,
      tags: tags || [],
      startedAt: startDate,
      completedAt,
      daysToComplete,
    });
    
    res.status(201).json({
      success: true,
      data: { completion },
    });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key (already completed)
      const existing = await SkillCompletion.findOne({
        userId: req.user.id,
        roadmapId: req.body.roadmapId,
      });
      return res.status(200).json({
        success: true,
        data: { completion: existing },
      });
    }
    next(error);
  }
};
