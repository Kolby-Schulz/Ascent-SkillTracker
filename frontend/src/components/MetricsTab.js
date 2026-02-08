import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { getMyMetrics } from '../services/metricsService';
import './MetricsTab.css';

// Color palette: 254c5d, 011c2f, d9bba3, aea79d, 546672
const STAT_CARDS = [
  { key: 'skillsLearned', label: 'Skills Learned', icon: '✅', micro: '' },
  { key: 'skillsInProgress', label: 'Skills in progress', icon: '📚', micro: '' },
  { key: 'guidesUploaded', label: 'Guides Created', icon: '📝', micro: '' },
  { key: 'totalGuideLikes', label: 'Total Likes', icon: '❤', iconClass: 'icon-red', micro: '' },
];

const MetricsTab = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMetrics = useCallback(async (showRefreshing = false) => {
    const token = localStorage.getItem('token')?.trim();
    if (token === 'demo-bypass-token') {
      setMetrics({
        skillsLearned: 0,
        skillsInProgress: 0,
        guidesUploaded: 0,
        totalGuideViews: 0,
        totalGuideLikes: 0,
      });
      setError(null);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      if (!showRefreshing) setLoading(true);
      else setRefreshing(true);
      setError(null);
      const res = await getMyMetrics();
      setMetrics(res?.metrics || {
        skillsLearned: 0,
        skillsInProgress: 0,
        guidesUploaded: 0,
        totalGuideViews: 0,
        totalGuideLikes: 0,
      });
      setLastUpdated(new Date());
    } catch (err) {
      const msg =
        err.response?.status === 401
          ? 'Please log in again'
          : err.response?.data?.error ||
            (err.code === 'ERR_NETWORK' ? 'Backend not reachable' : 'Failed to load metrics');
      setError(msg);
      setMetrics({
        skillsLearned: 0,
        skillsInProgress: 0,
        guidesUploaded: 0,
        totalGuideViews: 0,
        totalGuideLikes: 0,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  useEffect(() => {
    const token = localStorage.getItem('token')?.trim();
    if (token === 'demo-bypass-token') return;
    const interval = setInterval(() => fetchMetrics(true), 60000);
    return () => clearInterval(interval);
  }, [fetchMetrics]);

  const formatLastUpdated = (d) => {
    if (!d) return null;
    const now = new Date();
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const skillsLearned = metrics?.skillsLearned ?? 0;
  const skillsInProgress = metrics?.skillsInProgress ?? 0;
  const totalSkills = skillsLearned + skillsInProgress;
  const learnedPercent = totalSkills > 0 ? Math.round((skillsLearned / totalSkills) * 100) : 0;

  if (loading) {
    return (
      <div className="metrics-tab">
        <div className="metrics-tab-header">
          <h3 className="metrics-tab-title">Metrics</h3>
        </div>
        <div className="metrics-stat-cards-skeleton">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="metric-stat-skeleton" />
          ))}
        </div>
        <div className="metric-skeleton-line" style={{ marginTop: 12 }} />
      </div>
    );
  }

  return (
    <div className="metrics-tab">
      <div className="metrics-tab-header">
        <h3 className="metrics-tab-title">Metrics</h3>
        <button
          className="metrics-refresh-btn"
          onClick={() => fetchMetrics(true)}
          disabled={refreshing}
          title="Refresh metrics"
          aria-label="Refresh metrics"
        >
          <span className={`metrics-refresh-icon ${refreshing ? 'spinning' : ''}`}>↻</span>
        </button>
      </div>
      {lastUpdated && !error && (
        <p className="metrics-last-updated">Updated {formatLastUpdated(lastUpdated)}</p>
      )}

      {/* Classic Stat Cards */}
      <div className="metrics-stat-cards">
        {STAT_CARDS.map((card, i) => (
          <motion.div
            key={card.key}
            className="metrics-stat-card"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className={`metrics-stat-icon ${card.iconClass || ''}`}>{card.icon}</div>
            <span className="metrics-stat-value">{metrics?.[card.key] ?? 0}</span>
            <span className="metrics-stat-label">{card.label}</span>
            {card.micro && (
              <span className="metrics-stat-micro">{card.micro}</span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Learning Progress Bar */}
      {totalSkills > 0 && (
        <motion.div
          className="metrics-progress-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h4 className="metrics-progress-title">Learning Progress</h4>
          <div className="metrics-progress-bar-wrapper">
            <div className="metrics-progress-bar">
              <motion.div
                className="metrics-progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${learnedPercent}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
            <p className="metrics-progress-text">
              {skillsLearned} / {totalSkills} skills completed
            </p>
            <p className="metrics-progress-sub">{skillsInProgress} skills in progress</p>
          </div>
        </motion.div>
      )}

      {error && (
        <div className="metrics-error-row">
          <span className="metrics-error">{error}</span>
          <button className="metrics-retry" onClick={fetchMetrics}>
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default MetricsTab;
