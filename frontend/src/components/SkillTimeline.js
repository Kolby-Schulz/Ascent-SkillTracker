import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { getCompletedSkillsCount } from '../utils/achievements';
import './SkillTimeline.css';

const SkillTimeline = () => {
  const { t } = useTranslation(['profile', 'common']);
  const { user } = useAuth();
  const [completedSkills, setCompletedSkills] = useState([]);
  const [timelineData, setTimelineData] = useState([]);

  useEffect(() => {
    // Get completed skills from localStorage
    const STORAGE_KEY = 'metrics-completed-ids';
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      const completedIds = arr.filter(id => id && id.startsWith('skill:'));
      
      const skills = completedIds
        .map(id => id.replace('skill:', ''))
        .map(skillId => ({
          id: skillId,
          name: formatSkillName(skillId),
          completedAt: getSkillCompletionDate(skillId),
        }))
        .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

      setCompletedSkills(skills);
      
      // Group by month/year for timeline
      const grouped = groupByMonth(skills);
      setTimelineData(grouped);
    } catch (error) {
      console.error('Error loading timeline data:', error);
      setCompletedSkills([]);
      setTimelineData([]);
    }
  }, []);

  const formatSkillName = (skillId) => {
    return skillId
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getSkillCompletionDate = (skillId) => {
    // Try to get from localStorage, or use current date as fallback
    const key = `skill-completed-${skillId}`;
    const stored = localStorage.getItem(key);
    return stored ? new Date(stored) : new Date();
  };

  const groupByMonth = (skills) => {
    const groups = {};
    skills.forEach(skill => {
      const date = new Date(skill.completedAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!groups[monthKey]) {
        groups[monthKey] = {
          month: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          skills: [],
        };
      }
      groups[monthKey].skills.push(skill);
    });
    return Object.entries(groups)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([_, data]) => data);
  };

  if (completedSkills.length === 0) {
    return (
      <div className="timeline-empty glass-panel">
        <div className="timeline-empty-icon">📅</div>
        <h3 className="timeline-empty-title">{t('profile:timeline.empty.title')}</h3>
        <p className="timeline-empty-description">{t('profile:timeline.empty.description')}</p>
      </div>
    );
  }

  return (
    <div className="skill-timeline">
      <div className="timeline-header">
        <h2 className="timeline-title">{t('profile:timeline.title')}</h2>
        <p className="timeline-subtitle">{t('profile:timeline.subtitle', { count: completedSkills.length })}</p>
      </div>

      <div className="timeline-container">
        {timelineData.map((group, groupIndex) => (
          <div key={groupIndex} className="timeline-group">
            <div className="timeline-month">
              <div className="timeline-month-line"></div>
              <h3 className="timeline-month-title">{group.month}</h3>
            </div>
            <div className="timeline-skills">
              {group.skills.map((skill, skillIndex) => (
                <motion.div
                  key={skill.id}
                  className="timeline-skill-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (groupIndex * 0.1) + (skillIndex * 0.05) }}
                >
                  <div className="timeline-skill-dot"></div>
                  <div className="timeline-skill-content glass-panel">
                    <div className="timeline-skill-icon">🏆</div>
                    <div className="timeline-skill-info">
                      <h4 className="timeline-skill-name">{skill.name}</h4>
                      <p className="timeline-skill-date">
                        {new Date(skill.completedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillTimeline;
