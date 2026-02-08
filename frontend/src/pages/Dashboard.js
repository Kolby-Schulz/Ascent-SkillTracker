import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSkills } from '../context/SkillsContext';
import { sortSkillsWithCompletedAtEnd, getSkillOrRoadmapStatus } from '../utils/skillProgress';
import progressService from '../services/progressService';
import userSkillService from '../services/userSkillService';
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
  const [friendProgressByRoadmapId, setFriendProgressByRoadmapId] = useState({});
  const [usersLearningBySkillName, setUsersLearningBySkillName] = useState({});

  const roadmapIds = useMemo(
    () => skills.map((s) => getRoadmapId(s)).filter(Boolean),
    [skills, getRoadmapId]
  );

  useEffect(() => {
    if (roadmapIds.length === 0) return;
    const abort = new AbortController();
    const fetchAll = async () => {
      const results = await Promise.allSettled(
        roadmapIds.map((rid) => progressService.getFriendProgress(rid))
      );
      const next = {};
      results.forEach((result, i) => {
        const rid = roadmapIds[i];
        if (result.status === 'fulfilled' && result.value?.data?.data?.friendProgress) {
          next[rid] = result.value.data.data.friendProgress;
        } else {
          next[rid] = [];
        }
      });
      if (!abort.signal.aborted) setFriendProgressByRoadmapId(next);
    };
    fetchAll();
    return () => abort.abort();
  }, [roadmapIds.join(',')]);

  // Sync current user's skills to backend; fetch friends learning each skill (refetched on tab focus so removals by friends show up)
  const fetchUsersLearningBySkill = useCallback(async () => {
    if (!skills.length) return;
    const skillNames = [...new Set(skills)];
    await Promise.allSettled(
      skillNames.map((name) => userSkillService.upsertSkill(name, 'in_progress'))
    );
    const results = await Promise.allSettled(
      skillNames.map((name) => userSkillService.getUsersLearningSkill(name))
    );
    const next = {};
    results.forEach((result, i) => {
      const name = skillNames[i];
      if (result.status === 'fulfilled' && result.value?.data?.data?.users) {
        next[name] = result.value.data.data.users;
      } else {
        next[name] = [];
      }
    });
    setUsersLearningBySkillName(next);
  }, [skills.join(',')]);

  useEffect(() => {
    fetchUsersLearningBySkill();
  }, [fetchUsersLearningBySkill]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') fetchUsersLearningBySkill();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [fetchUsersLearningBySkill]);

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

  const handleRemoveSkill = async (skillToRemove, e) => {
    e.stopPropagation();
    removeSkill(skillToRemove);
    try {
      await userSkillService.removeSkill(skillToRemove);
    } catch {
      // e.g. not logged in or offline; local remove already applied
    }
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
              const roadmapId = getRoadmapId(skill);
              const friendsOnPath = (roadmapId && friendProgressByRoadmapId[roadmapId]) || [];
              const usersBySkill = usersLearningBySkillName[skill] || [];
              const merged = [];
              const seen = new Set();
              for (const f of friendsOnPath) {
                const id = f.userId?.toString?.() || f.userId;
                if (id && !seen.has(id)) {
                  seen.add(id);
                  merged.push({ userId: id, username: f.username });
                }
              }
              for (const u of usersBySkill) {
                const id = u.userId?.toString?.() || u.userId;
                if (id && !seen.has(id)) {
                  seen.add(id);
                  merged.push({ userId: id, username: u.username });
                }
              }
              const displayFriends = merged.slice(0, 3);
              const hasMoreFriends = merged.length > 3;
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
                    {displayFriends.length > 0 && (
                      <div className="skill-card-friends" title={t('dashboard:friendsOnPath', { count: merged.length })}>
                        {displayFriends.map((friend) => (
                          <div
                            key={friend.userId}
                            className="skill-card-friend-avatar"
                            title={friend.username}
                          >
                            {friend.username ? friend.username.charAt(0).toUpperCase() : '?'}
                          </div>
                        ))}
                        {hasMoreFriends && <span className="skill-card-friend-more">…</span>}
                      </div>
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
