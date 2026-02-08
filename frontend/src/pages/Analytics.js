import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import analyticsService from '../services/analyticsService';
import './Analytics.css';

const Analytics = () => {
  const { t } = useTranslation(['analytics', 'common']);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await analyticsService.getAnalytics();
        setAnalytics(response.data.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError(err.response?.data?.error || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="analytics-container">
        <div className="analytics-loading glass-panel">
          <p>{t('analytics:loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-container">
        <div className="analytics-error glass-panel">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  const { timeSpentPerSkill, velocityChart, trendChart, insights } = analytics;

  // Calculate max values for charts
  const maxVelocity = Math.max(...velocityChart.map((v) => v.completions), 1);
  const maxTrend = Math.max(...trendChart.map((t) => t.completions), 1);
  const maxTimeSpent = Math.max(...timeSpentPerSkill.map((s) => s.totalHours), 1);

  return (
    <div className="analytics-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="analytics-header glass-panel"
      >
        <h1 className="analytics-title">{t('analytics:title')}</h1>
        <p className="analytics-subtitle">{t('analytics:subtitle')}</p>
      </motion.div>

      {/* Insights Cards */}
      <div className="analytics-insights">
        <motion.div
          className="insight-card glass-panel"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="insight-icon">📚</div>
          <div className="insight-value">{insights.totalCompleted}</div>
          <div className="insight-label">{t('analytics:skillsCompleted')}</div>
        </motion.div>

        <motion.div
          className="insight-card glass-panel"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="insight-icon">🚀</div>
          <div className="insight-value">{insights.totalInProgress}</div>
          <div className="insight-label">{t('analytics:skillsInProgress')}</div>
        </motion.div>

        <motion.div
          className="insight-card glass-panel"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="insight-icon">⏱️</div>
          <div className="insight-value">{insights.totalTimeSpentHours}h</div>
          <div className="insight-label">{t('analytics:totalTimeSpent')}</div>
        </motion.div>

        <motion.div
          className="insight-card glass-panel"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="insight-icon">📈</div>
          <div className="insight-value">{insights.averageDaysToComplete}</div>
          <div className="insight-label">{t('analytics:avgDaysToComplete')}</div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="analytics-charts">
        {/* Time Spent Per Skill */}
        <motion.div
          className="chart-container glass-panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="chart-title">{t('analytics:timeSpentPerSkill')}</h2>
          <div className="time-spent-chart">
            {timeSpentPerSkill.length > 0 ? (
              timeSpentPerSkill.map((skill, index) => (
                <div key={index} className="time-spent-item">
                  <div className="skill-name">{skill.skillName}</div>
                  <div className="skill-bar-container">
                    <motion.div
                      className="skill-bar"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(skill.totalHours / maxTimeSpent) * 100}%`,
                      }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                    />
                  </div>
                  <div className="skill-time">
                    {skill.totalHours}h ({skill.stepCount} {t('analytics:steps')})
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">{t('analytics:noTimeData')}</p>
            )}
          </div>
        </motion.div>

        {/* Learning Velocity */}
        <motion.div
          className="chart-container glass-panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="chart-title">{t('analytics:learningVelocity')}</h2>
          <div className="velocity-chart">
            {velocityChart.length > 0 ? (
              <div className="chart-bars">
                {velocityChart.map((item, index) => {
                  // Create varied colors for each bar
                  const colors = [
                    'linear-gradient(180deg, #10b981, #059669)',
                    'linear-gradient(180deg, #D9BBA3, #c9a893)',
                    'linear-gradient(180deg, #a855f7, #9333ea)',
                    'linear-gradient(180deg, #3b82f6, #2563eb)',
                    'linear-gradient(180deg, #f59e0b, #d97706)',
                    'linear-gradient(180deg, #ef4444, #dc2626)',
                  ];
                  const colorIndex = index % colors.length;
                  
                  return (
                    <div key={index} className="chart-bar-item">
                      <div className="bar-container">
                        <motion.div
                          className="bar-fill velocity-bar"
                          style={{ background: colors[colorIndex] }}
                          initial={{ height: 0 }}
                          animate={{
                            height: `${(item.completions / maxVelocity) * 100}%`,
                          }}
                          transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                        />
                      </div>
                      <div className="bar-label">{item.completions}</div>
                      <div className="bar-month">
                        {new Date(item.month + '-01').toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="no-data">{t('analytics:noVelocityData')}</p>
            )}
          </div>
        </motion.div>

        {/* 30-Day Trend */}
        <motion.div
          className="chart-container glass-panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className="chart-title">{t('analytics:thirtyDayTrend')}</h2>
          <div className="trend-chart">
            {trendChart.length > 0 ? (
              <div className="chart-bars">
                {trendChart.map((item, index) => (
                  <div key={index} className="chart-bar-item">
                    <div className="bar-container">
                      <motion.div
                        className="bar-fill trend-bar"
                        initial={{ height: 0 }}
                        animate={{
                          height: `${(item.completions / maxTrend) * 100}%`,
                        }}
                        transition={{ delay: 0.8 + index * 0.02, duration: 0.3 }}
                      />
                    </div>
                    <div className="bar-label">{item.completions}</div>
                    {index % 5 === 0 && (
                      <div className="bar-date">
                        {new Date(item.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">{t('analytics:noTrendData')}</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Additional Insights */}
      {(insights.fastestSkill || insights.slowestSkill || insights.topCategory) && (
        <motion.div
          className="analytics-additional glass-panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="section-title">{t('analytics:additionalInsights')}</h2>
          <div className="additional-insights-grid">
            {insights.fastestSkill && (
              <div className="additional-insight">
                <span className="insight-emoji">⚡</span>
                <div>
                  <div className="insight-title">{t('analytics:fastestSkill')}</div>
                  <div className="insight-detail">
                    {insights.fastestSkill.name} ({insights.fastestSkill.days}{' '}
                    {t('analytics:days')})
                  </div>
                </div>
              </div>
            )}
            {insights.slowestSkill && (
              <div className="additional-insight">
                <span className="insight-emoji">🐢</span>
                <div>
                  <div className="insight-title">{t('analytics:slowestSkill')}</div>
                  <div className="insight-detail">
                    {insights.slowestSkill.name} ({insights.slowestSkill.days}{' '}
                    {t('analytics:days')})
                  </div>
                </div>
              </div>
            )}
            {insights.topCategory && (
              <div className="additional-insight">
                <span className="insight-emoji">🏆</span>
                <div>
                  <div className="insight-title">{t('analytics:topCategory')}</div>
                  <div className="insight-detail">
                    {insights.topCategory.name} ({insights.topCategory.count}{' '}
                    {t('analytics:skills')})
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Analytics;
