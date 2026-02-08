/**
 * Achievement and Streak Tracking System
 * Tracks user activity, streaks, and unlocks achievements
 */

// Achievement definitions
export const ACHIEVEMENTS = {
  FIRST_STEP: {
    id: 'first_step',
    name: 'First Steps',
    description: 'Complete your first learning step',
    icon: '👣',
    rarity: 'common',
  },
  FIRST_SKILL: {
    id: 'first_skill',
    name: 'Skill Master',
    description: 'Complete your first skill',
    icon: '🏆',
    rarity: 'rare',
  },
  FIVE_SKILLS: {
    id: 'five_skills',
    name: 'Rising Star',
    description: 'Complete 5 skills',
    icon: '⭐',
    rarity: 'rare',
  },
  TEN_SKILLS: {
    id: 'ten_skills',
    name: 'Expert Learner',
    description: 'Complete 10 skills',
    icon: '🌟',
    rarity: 'epic',
  },
  STREAK_3: {
    id: 'streak_3',
    name: 'On Fire',
    description: 'Maintain a 3-day learning streak',
    icon: '🔥',
    rarity: 'common',
  },
  STREAK_7: {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day learning streak',
    icon: '💪',
    rarity: 'rare',
  },
  STREAK_30: {
    id: 'streak_30',
    name: 'Dedicated',
    description: 'Maintain a 30-day learning streak',
    icon: '💎',
    rarity: 'epic',
  },
  CREATOR: {
    id: 'creator',
    name: 'Creator',
    description: 'Create your first roadmap',
    icon: '📝',
    rarity: 'common',
  },
  MENTOR: {
    id: 'mentor',
    name: 'Mentor',
    description: 'Create 5 roadmaps',
    icon: '👨‍🏫',
    rarity: 'rare',
  },
  SOCIAL_BUTTERFLY: {
    id: 'social_butterfly',
    name: 'Social Butterfly',
    description: 'Add 5 friends',
    icon: '🦋',
    rarity: 'common',
  },
};

// Get all achievement IDs
export const getAllAchievementIds = () => Object.keys(ACHIEVEMENTS);

// Get user's unlocked achievements from localStorage
export const getUnlockedAchievements = (userId) => {
  const key = `achievements_${userId}`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
};

// Unlock an achievement
export const unlockAchievement = (userId, achievementId) => {
  const unlocked = getUnlockedAchievements(userId);
  if (!unlocked.includes(achievementId)) {
    unlocked.push(achievementId);
    const key = `achievements_${userId}`;
    localStorage.setItem(key, JSON.stringify(unlocked));
    return true; // Newly unlocked
  }
  return false; // Already unlocked
};

// Check if achievement is unlocked
export const isAchievementUnlocked = (userId, achievementId) => {
  const unlocked = getUnlockedAchievements(userId);
  return unlocked.includes(achievementId);
};

// Get streak data
export const getStreakData = (userId) => {
  const key = `streak_${userId}`;
  const stored = localStorage.getItem(key);
  if (!stored) {
    return { currentStreak: 0, longestStreak: 0, lastActivityDate: null };
  }
  return JSON.parse(stored);
};

// Update streak (call this when user completes a step or skill)
export const updateStreak = (userId) => {
  const key = `streak_${userId}`;
  const today = new Date().toDateString();
  const streakData = getStreakData(userId);
  
  // If last activity was today, don't update
  if (streakData.lastActivityDate === today) {
    return streakData;
  }
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toDateString();
  
  // If last activity was yesterday, increment streak
  if (streakData.lastActivityDate === yesterdayString) {
    streakData.currentStreak += 1;
  } else if (streakData.lastActivityDate !== today) {
    // If last activity was more than 1 day ago, reset streak
    streakData.currentStreak = 1;
  }
  
  // Update longest streak if current is longer
  if (streakData.currentStreak > streakData.longestStreak) {
    streakData.longestStreak = streakData.currentStreak;
  }
  
  streakData.lastActivityDate = today;
  localStorage.setItem(key, JSON.stringify(streakData));
  
  return streakData;
};

// Check and unlock streak achievements
export const checkStreakAchievements = (userId) => {
  const streakData = getStreakData(userId);
  const unlocked = [];
  
  if (streakData.currentStreak >= 3 && !isAchievementUnlocked(userId, 'streak_3')) {
    unlockAchievement(userId, 'streak_3');
    unlocked.push('streak_3');
  }
  
  if (streakData.currentStreak >= 7 && !isAchievementUnlocked(userId, 'streak_7')) {
    unlockAchievement(userId, 'streak_7');
    unlocked.push('streak_7');
  }
  
  if (streakData.currentStreak >= 30 && !isAchievementUnlocked(userId, 'streak_30')) {
    unlockAchievement(userId, 'streak_30');
    unlocked.push('streak_30');
  }
  
  return unlocked;
};

// Check skill completion achievements
export const checkSkillAchievements = (userId, completedSkillsCount) => {
  const unlocked = [];
  
  if (completedSkillsCount >= 1 && !isAchievementUnlocked(userId, 'first_skill')) {
    unlockAchievement(userId, 'first_skill');
    unlocked.push('first_skill');
  }
  
  if (completedSkillsCount >= 5 && !isAchievementUnlocked(userId, 'five_skills')) {
    unlockAchievement(userId, 'five_skills');
    unlocked.push('five_skills');
  }
  
  if (completedSkillsCount >= 10 && !isAchievementUnlocked(userId, 'ten_skills')) {
    unlockAchievement(userId, 'ten_skills');
    unlocked.push('ten_skills');
  }
  
  return unlocked;
};

// Get total completed skills count (from skillProgress utility)
export const getCompletedSkillsCount = () => {
  // Read from the same storage key used by skillProgress utility
  const STORAGE_KEY = 'metrics-completed-ids';
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    // Count only skills (keys starting with 'skill:')
    return arr.filter(id => id && id.startsWith('skill:')).length;
  } catch {
    return 0;
  }
};
