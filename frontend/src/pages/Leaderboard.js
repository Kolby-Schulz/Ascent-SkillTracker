import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import leaderboardService from '../services/leaderboardService';
import './Leaderboard.css';

const Leaderboard = () => {
  const { t } = useTranslation(['leaderboard', 'common']);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scope, setScope] = useState('all'); // 'all' or 'friends'
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [currentUserIndex, setCurrentUserIndex] = useState(null);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await leaderboardService.getFilters();
        setCategories(response.data?.categories || []);
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };
    fetchFilters();
  }, []);

  // Generate fake users for demo
  const generateFakeUsers = (count = 20) => {
    const fakeNames = [
      'Alex', 'Jordan', 'Sam', 'Taylor', 'Casey', 'Morgan', 'Riley', 'Avery',
      'Quinn', 'Blake', 'Cameron', 'Dakota', 'Emery', 'Finley', 'Harper',
      'Hayden', 'Jamie', 'Kai', 'Logan', 'Parker', 'River', 'Sage', 'Skyler'
    ];
    const categories = ['Programming', 'Design', 'Music', 'Fitness', 'Cooking', 'Photography', 'Writing', 'Art'];
    const tags = ['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master'];
    
    const users = [];
    for (let i = 0; i < count; i++) {
      const name = fakeNames[Math.floor(Math.random() * fakeNames.length)] + Math.floor(Math.random() * 100);
      const totalCompleted = Math.floor(Math.random() * 15) + 1;
      const avgDays = Math.random() * 20 + 1;
      
      users.push({
        userId: `fake-${i}`,
        username: name,
        totalCompleted,
        averageDays: avgDays,
        rank: i + 1,
        category: categories[Math.floor(Math.random() * categories.length)],
        tags: [tags[Math.floor(Math.random() * tags.length)]],
      });
    }
    
    // Sort by total completed (desc), then by average days (asc)
    users.sort((a, b) => {
      if (b.totalCompleted !== a.totalCompleted) {
        return b.totalCompleted - a.totalCompleted;
      }
      return a.averageDays - b.averageDays;
    });
    
    // Re-assign ranks
    users.forEach((user, index) => {
      user.rank = index + 1;
    });
    
    return users;
  };

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const response = await leaderboardService.getLeaderboard(
          scope,
          category || null,
          null // No tag filter
        );
        let rankings = response.data?.rankings || [];
        
        // Add fake users for demo (filter by category if needed)
        const fakeUsers = generateFakeUsers(20);
        let filteredFakeUsers = fakeUsers;
        
        if (category) {
          filteredFakeUsers = fakeUsers.filter(u => u.category === category);
        }
        
        // If scope is 'friends', only include real friends (no fake users)
        // Otherwise, merge real and fake users
        const allRankings = scope === 'friends' 
          ? rankings // Only show real friends when friends filter is on
          : [...rankings, ...filteredFakeUsers];
        
        // Remove duplicates (keep real users over fake ones)
        const uniqueRankings = [];
        const seenIds = new Set();
        allRankings.forEach(r => {
          const id = r.userId?.toString() || r.userId;
          if (!seenIds.has(id)) {
            seenIds.add(id);
            uniqueRankings.push(r);
          }
        });
        
        // Re-sort and re-rank
        uniqueRankings.sort((a, b) => {
          if (b.totalCompleted !== a.totalCompleted) {
            return b.totalCompleted - a.totalCompleted;
          }
          return a.averageDays - b.averageDays;
        });
        
        uniqueRankings.forEach((user, index) => {
          user.rank = index + 1;
        });
        
        setRankings(uniqueRankings);
        setCurrentUserIndex(response.data?.currentUserIndex);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        // Even on error, show fake users
        const fakeUsers = generateFakeUsers(20);
        setRankings(fakeUsers);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [scope, category]);

  const getRankIcon = (rank) => {
    if (!rank) return '-';
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const formatDays = (days) => {
    if (days < 1) return '< 1 day';
    if (days === 1) return '1 day';
    return `${Math.round(days)} days`;
  };

  const isCurrentUser = (userId) => {
    if (!userId || !user) return false;
    const userIdStr = userId?._id ? userId._id.toString() : userId.toString();
    const currentUserIdStr = user?.id ? user.id.toString() : (user?._id ? user._id.toString() : null);
    return userIdStr === currentUserIdStr;
  };

  const handleUserClick = (ranking) => {
    // Don't navigate if clicking on yourself
    if (isCurrentUser(ranking.userId)) {
      return;
    }
    
    // Extract user ID
    const userId = ranking.userId?._id ? ranking.userId._id.toString() : ranking.userId.toString();
    
    // Navigate to user profile
    navigate(`/dashboard/profile/${userId}`);
  };

  return (
    <motion.div
      className="leaderboard-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="leaderboard-header">
        <h1 className="leaderboard-title">🏆 {t('leaderboard:title')}</h1>
        <p className="leaderboard-subtitle">{t('leaderboard:subtitle')}</p>
      </div>

      {/* Filters */}
      <div className="leaderboard-filters">
        <div className="filter-group">
          <label className="filter-label">{t('leaderboard:scope')}</label>
          <div className="filter-buttons">
            <button
              className={`filter-button ${scope === 'all' ? 'active' : ''}`}
              onClick={() => setScope('all')}
            >
              {t('leaderboard:allUsers')}
            </button>
            <button
              className={`filter-button ${scope === 'friends' ? 'active' : ''}`}
              onClick={() => setScope('friends')}
            >
              {t('leaderboard:friends')}
            </button>
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">{t('leaderboard:category')}</label>
          <select
            className="filter-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">{t('leaderboard:allCategories')}</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="leaderboard-container">
        {loading ? (
          <div className="leaderboard-loading">{t('common:loading')}...</div>
        ) : rankings.length === 0 ? (
          <div className="leaderboard-empty">
            {t('leaderboard:noRankings')}
          </div>
        ) : (
          <>
            {/* Top 5 Section */}
            <div className="leaderboard-top-section">
              <h2 className="top-section-title">🏆 Top 5</h2>
              <div className="leaderboard-table top-5-table">
                <div className="leaderboard-header-row">
                  <div className="rank-col">{t('leaderboard:rank')}</div>
                  <div className="user-col">{t('leaderboard:user')}</div>
                  <div className="skills-col">{t('leaderboard:skillsCompleted')}</div>
                  <div className="time-col">{t('leaderboard:avgTime')}</div>
                </div>
                {rankings.slice(0, 5).map((ranking, index) => {
                  const isCurrent = isCurrentUser(ranking.userId);
                  return (
                    <motion.div
                      key={ranking.userId}
                      className={`leaderboard-row ${isCurrent ? 'current-user' : ''} top-5-row`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="rank-col">
                        <span className="rank-icon">{getRankIcon(ranking.rank)}</span>
                      </div>
                      <div className="user-col">
                        <div 
                          className={`user-info ${!isCurrent ? 'clickable-user' : ''}`}
                          onClick={() => !isCurrent && handleUserClick(ranking)}
                          style={{ cursor: isCurrent ? 'default' : 'pointer' }}
                        >
                          <div className="user-avatar">
                            {ranking.username?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <span className="user-name">
                            {ranking.username}
                            {isCurrent && <span className="you-badge"> (You)</span>}
                          </span>
                        </div>
                      </div>
                      <div className="skills-col">
                        <span className="skills-count">{ranking.totalCompleted}</span>
                      </div>
                      <div className="time-col">
                        <span className="time-value">
                          {ranking.totalCompleted > 0 ? formatDays(ranking.averageDays) : '-'}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Scrollable Rest of Rankings */}
            {rankings.length > 5 && (
              <div className="leaderboard-scrollable-section">
                <h3 className="scrollable-section-title">All Rankings</h3>
                <div className="leaderboard-table scrollable-table">
                  <div className="leaderboard-header-row">
                    <div className="rank-col">{t('leaderboard:rank')}</div>
                    <div className="user-col">{t('leaderboard:user')}</div>
                    <div className="skills-col">{t('leaderboard:skillsCompleted')}</div>
                    <div className="time-col">{t('leaderboard:avgTime')}</div>
                  </div>
                  <div className="scrollable-content">
                    {rankings.slice(5).map((ranking, index) => {
                      const isCurrent = isCurrentUser(ranking.userId);
                      return (
                        <motion.div
                          key={ranking.userId}
                          className={`leaderboard-row ${isCurrent ? 'current-user' : ''}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (index + 5) * 0.02 }}
                        >
                          <div className="rank-col">
                            <span className="rank-icon">{getRankIcon(ranking.rank)}</span>
                          </div>
                          <div className="user-col">
                            <div 
                              className={`user-info ${!isCurrent ? 'clickable-user' : ''}`}
                              onClick={() => !isCurrent && handleUserClick(ranking)}
                              style={{ cursor: isCurrent ? 'default' : 'pointer' }}
                            >
                              <div className="user-avatar">
                                {ranking.username?.charAt(0).toUpperCase() || '?'}
                              </div>
                              <span className="user-name">
                                {ranking.username}
                                {isCurrent && <span className="you-badge"> (You)</span>}
                              </span>
                            </div>
                          </div>
                          <div className="skills-col">
                            <span className="skills-count">{ranking.totalCompleted}</span>
                          </div>
                          <div className="time-col">
                            <span className="time-value">
                              {ranking.totalCompleted > 0 ? formatDays(ranking.averageDays) : '-'}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Leaderboard;
