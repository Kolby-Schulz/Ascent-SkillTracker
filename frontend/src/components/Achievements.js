import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import {
  ACHIEVEMENTS,
  getUnlockedAchievements,
  getStreakData,
  getAllAchievementIds,
} from '../utils/achievements';
import './Achievements.css';

const Achievements = () => {
  const { t } = useTranslation(['achievements', 'common']);
  const { user } = useAuth();
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [streakData, setStreakData] = useState({ currentStreak: 0, longestStreak: 0 });
  const [selectedCategory, setSelectedCategory] = useState('all'); // all, unlocked, locked

  const userId = user?.id || user?._id || 'default';

  useEffect(() => {
    // Load unlocked achievements
    const unlocked = getUnlockedAchievements(userId);
    setUnlockedAchievements(unlocked);
    
    // Load streak data
    const streak = getStreakData(userId);
    setStreakData(streak);
  }, [userId]);

  // Refresh data when component is visible (in case achievements were unlocked elsewhere)
  const refreshData = () => {
    const unlocked = getUnlockedAchievements(userId);
    setUnlockedAchievements(unlocked);
    const streak = getStreakData(userId);
    setStreakData(streak);
  };

  useEffect(() => {
    // Refresh every 2 seconds to catch new achievements
    const interval = setInterval(refreshData, 2000);
    return () => clearInterval(interval);
  }, [userId]);

  const allAchievements = getAllAchievementIds().map(id => ACHIEVEMENTS[id]);
  
  const filteredAchievements = allAchievements.filter(achievement => {
    if (selectedCategory === 'unlocked') {
      return unlockedAchievements.includes(achievement.id);
    } else if (selectedCategory === 'locked') {
      return !unlockedAchievements.includes(achievement.id);
    }
    return true; // 'all'
  });

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common':
        return '#9ca3af'; // Gray
      case 'rare':
        return '#3b82f6'; // Blue
      case 'epic':
        return '#a855f7'; // Purple
      case 'legendary':
        return '#f59e0b'; // Gold
      default:
        return '#9ca3af';
    }
  };

  return (
    <div className="achievements-container">
      {/* Streak Display */}
      <motion.div
        className="streak-section glass-panel"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="streak-title">{t('achievements:streak.title')}</h2>
        <div className="streak-stats">
          <div className="streak-stat">
            <div className="streak-icon">🔥</div>
            <div className="streak-info">
              <p className="streak-label">{t('achievements:streak.current')}</p>
              <p className="streak-value">{streakData.currentStreak} {t('achievements:streak.days')}</p>
            </div>
          </div>
          <div className="streak-stat">
            <div className="streak-icon">💎</div>
            <div className="streak-info">
              <p className="streak-label">{t('achievements:streak.longest')}</p>
              <p className="streak-value">{streakData.longestStreak} {t('achievements:streak.days')}</p>
            </div>
          </div>
        </div>
        {streakData.currentStreak > 0 && (
          <p className="streak-message">
            {t('achievements:streak.message', { count: streakData.currentStreak })}
          </p>
        )}
      </motion.div>

      {/* Achievements Grid */}
      <div className="achievements-header">
        <h2 className="achievements-title">{t('achievements:title')}</h2>
        <div className="achievements-filters">
          <button
            className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            {t('achievements:filters.all')}
          </button>
          <button
            className={`filter-btn ${selectedCategory === 'unlocked' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('unlocked')}
          >
            {t('achievements:filters.unlocked')} ({unlockedAchievements.length})
          </button>
          <button
            className={`filter-btn ${selectedCategory === 'locked' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('locked')}
          >
            {t('achievements:filters.locked')}
          </button>
        </div>
      </div>

      <div className="achievements-grid">
        <AnimatePresence>
          {filteredAchievements.map((achievement, index) => {
            const isUnlocked = unlockedAchievements.includes(achievement.id);
            return (
              <motion.div
                key={achievement.id}
                className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div
                  className="achievement-icon"
                  style={{
                    filter: isUnlocked ? 'none' : 'grayscale(100%) brightness(0.5)',
                    borderColor: getRarityColor(achievement.rarity),
                  }}
                >
                  {achievement.icon}
                </div>
                <div className="achievement-info">
                  <h3 className="achievement-name">{achievement.name}</h3>
                  <p className="achievement-description">{achievement.description}</p>
                  <span
                    className="achievement-rarity"
                    style={{ color: getRarityColor(achievement.rarity) }}
                  >
                    {achievement.rarity.toUpperCase()}
                  </span>
                </div>
                {isUnlocked && (
                  <motion.div
                    className="unlocked-badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    ✓
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredAchievements.length === 0 && (
        <div className="no-achievements">
          <p>{t('achievements:noAchievements')}</p>
        </div>
      )}
    </div>
  );
};

export default Achievements;
