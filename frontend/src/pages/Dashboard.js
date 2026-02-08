import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSkills } from '../context/SkillsContext';
import { sortSkillsWithCompletedAtEnd, getSkillOrRoadmapStatus } from '../utils/skillProgress';
import './Dashboard.css';

// Map skill names to their URL-friendly IDs
const SKILL_ID_MAP = {
  'Guitar': 'guitar',
  'Fishing': 'fishing',
  'Singing': 'singing',
  'Web Development': 'web-development',
  'Photography': 'photography',
  'Cooking': 'cooking',
};

const SUGGESTED_SKILLS_POOL = [
  'Cooking', 'Photography', 'Spanish', 'Woodworking', 'Chess',
  'Piano', 'Drawing', 'Running', 'Meditation', 'Baking',
  'Gardening', 'Sewing', 'Knitting', 'Calligraphy', 'Hiking',
];

const getRandomSuggestedSkills = (count = 5) => {
  const shuffled = [...SUGGESTED_SKILLS_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

const Dashboard = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const { user } = useAuth();
  const { skills, removeSkill, getRoadmapId } = useSkills();
  const navigate = useNavigate();

  const userDisplayName = user?.username || user?.email?.split('@')[0] || 'User';

  const handleSkillClick = (skillName) => {
    const roadmapId = getRoadmapId(skillName);
    if (roadmapId) {
      navigate(`/roadmap/${roadmapId}`);
      return;
    }
    const skillId = SKILL_ID_MAP[skillName] || skillName.toLowerCase().replace(/\s+/g, '-');
    navigate(`/skill/${skillId}`);
  };

  const handleRemoveSkill = (skillToRemove, e) => {
    e.stopPropagation();
    removeSkill(skillToRemove);
  };

  // Completed skills at end; order: not-started, in-progress, completed (includes roadmaps)
  const sortedSkills = sortSkillsWithCompletedAtEnd(skills, getRoadmapId);

  return (
    <>
      <div className="dashboard-content">
        <div className="main-header">
          <h1 className="greeting">{t('dashboard:greeting')}, {userDisplayName}</h1>
        </div>

        <div className="skills-section">
          <h2 className="skills-title">{t('dashboard:skillsInProgress')}</h2>

          <div className="skills-grid">
            {sortedSkills.map((skill, index) => {
              const status = getSkillOrRoadmapStatus(skill, getRoadmapId);
              const originalIndex = skills.indexOf(skill);
              return (
                <motion.div
                  key={`${skill}-${originalIndex}`}
                  className={`skill-card ${status === 'completed' ? 'skill-card--completed' : ''} ${status === 'in-progress' ? 'skill-card--in-progress' : ''}`}
                  onClick={() => handleSkillClick(skill)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="skill-card-content">
                    <span className="skill-icon">🎯</span>
                    <span className="skill-name">{skill}</span>
                    {status === 'completed' && (
                      <span className="skill-card-badge skill-card-badge--completed">{t('dashboard:completed')}</span>
                    )}
                    {status === 'in-progress' && (
                      <span className="skill-card-badge skill-card-badge--in-progress">{t('dashboard:inProgress')}</span>
                    )}
                    <div className="skill-actions">
                      <span className="skill-drag-hint">{t('dashboard:clickToView')}</span>
                      <div className="skill-buttons">
                        <button
                          className="skill-remove"
                          onClick={(e) => handleRemoveSkill(skill, e)}
                          title={t('dashboard:removeSkillTitle')}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
