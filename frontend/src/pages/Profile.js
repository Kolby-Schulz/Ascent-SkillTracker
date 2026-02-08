import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import roadmapService from '../services/roadmapService';
import postService from '../services/postService';
import Achievements from '../components/Achievements';
import SkillTimeline from '../components/SkillTimeline';
import './Profile.css';

const Profile = () => {
  const { t } = useTranslation(['profile', 'common']);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [roadmaps, setRoadmaps] = useState([]);
  const [filter, setFilter] = useState('all'); // all, published, draft
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('roadmaps'); // roadmaps, achievements, timeline

  const userDisplayName = user?.username || user?.email?.split('@')[0] || 'User';

  useEffect(() => {
    // TODO: Fetch user's roadmaps from API
    // For now, using mock data
    fetchRoadmaps();
  }, []);

  const fetchRoadmaps = async () => {
    setLoading(true);
    try {
      const response = await roadmapService.getMyRoadmaps();
      const list = Array.isArray(response.data) ? response.data : [];
      const roadmapsData = list.map((roadmap) => ({
        id: roadmap._id,
        name: roadmap.name,
        status: roadmap.status || 'draft',
        subSkillCount: roadmap.subSkills?.length || 0,
        studentsCount: roadmap.studentsCount ?? 0,
        createdAt: roadmap.createdAt,
        updatedAt: roadmap.updatedAt,
      }));
      setRoadmaps(roadmapsData);
    } catch (error) {
      console.error('Error fetching roadmaps:', error);
      setRoadmaps([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredRoadmaps = roadmaps.filter(roadmap => {
    if (filter === 'all') return true;
    return roadmap.status === filter;
  });

  const handleCreateNew = () => {
    navigate('/dashboard/create');
  };

  const handleEditRoadmap = (roadmapId) => {
    // TODO: Navigate to edit mode with roadmap data
    console.log('Edit roadmap:', roadmapId);
    navigate(`/dashboard/create?edit=${roadmapId}`);
  };

  const handleViewRoadmap = (roadmapId) => {
    navigate(`/roadmap/${roadmapId}`);
  };

  const handleShareToFeed = async (roadmapId, e) => {
    e.stopPropagation();
    const caption = window.prompt(t('profile:messages.shareCaption'));
    if (caption === null) return; // User cancelled

    try {
      await postService.createPost(roadmapId, caption || '');
      alert(t('profile:messages.shared'));
    } catch (error) {
      console.error('Error sharing to feed:', error);
      alert(error.response?.data?.error || t('profile:messages.shareError'));
    }
  };

  const handleDeleteRoadmap = async (roadmapId) => {
    if (window.confirm(t('profile:messages.deleteConfirm'))) {
      try {
        await roadmapService.deleteRoadmap(roadmapId);
        setRoadmaps(roadmaps.filter(r => r.id !== roadmapId));
        alert(t('profile:messages.deleted'));
      } catch (error) {
        console.error('Error deleting roadmap:', error);
        alert(error.error || t('profile:messages.deleteError'));
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="profile-page">
      <motion.div
        className="profile-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="profile-header-content">
          <div className="profile-avatar-large">
            {userDisplayName.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h1 className="profile-username">{userDisplayName}</h1>
            <p className="profile-stats">
              {roadmaps.length} {roadmaps.length !== 1 ? t('profile:stats.guidesCreatedPlural') : t('profile:stats.guidesCreated')} {t('profile:stats.created')}
            </p>
          </div>
        </div>
        <button className="create-new-button" onClick={handleCreateNew}>
          {t('profile:createNewRoadmap')}
        </button>
      </motion.div>

      {/* Tabs */}
      <div className="profile-tabs">
        <button
          className={`profile-tab ${activeTab === 'roadmaps' ? 'active' : ''}`}
          onClick={() => setActiveTab('roadmaps')}
        >
          {t('profile:myRoadmaps')}
        </button>
        <button
          className={`profile-tab ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          {t('profile:achievements')}
        </button>
        <button
          className={`profile-tab ${activeTab === 'timeline' ? 'active' : ''}`}
          onClick={() => setActiveTab('timeline')}
        >
          {t('profile:timeline.tab')}
        </button>
      </div>

      {activeTab === 'roadmaps' && (
      <div className="roadmaps-section">
        <div className="section-header">
          <h2 className="section-title">{t('profile:myRoadmaps')}</h2>
          <div className="filter-buttons">
            <button
              className={`filter-button ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              {t('profile:filters.all')} ({roadmaps.length})
            </button>
            <button
              className={`filter-button ${filter === 'published' ? 'active' : ''}`}
              onClick={() => setFilter('published')}
            >
              {t('profile:filters.published')} ({roadmaps.filter(r => r.status === 'published').length})
            </button>
            <button
              className={`filter-button ${filter === 'draft' ? 'active' : ''}`}
              onClick={() => setFilter('draft')}
            >
              {t('profile:filters.drafts')} ({roadmaps.filter(r => r.status === 'draft').length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>{t('profile:loading')}</p>
          </div>
        ) : filteredRoadmaps.length === 0 ? (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="empty-icon">📚</div>
            <h3 className="empty-title">
              {filter === 'all' 
                ? t('profile:empty.noRoadmaps')
                : `${t('profile:empty.noFiltered')} ${filter} ${t('profile:empty.roadmaps')}`
              }
            </h3>
            <p className="empty-description">
              {filter === 'all'
                ? t('profile:empty.description')
                : `${t('profile:empty.descriptionFiltered')} ${filter} ${t('profile:empty.roadmapsAtMoment')}`
              }
            </p>
            {filter === 'all' && (
              <button className="empty-cta-button" onClick={handleCreateNew}>
                {t('profile:empty.createFirst')}
              </button>
            )}
          </motion.div>
        ) : (
          <div className="roadmaps-grid">
            {filteredRoadmaps.map((roadmap, index) => (
              <motion.div
                key={roadmap.id}
                className="roadmap-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)' }}
              >
                <div className="roadmap-card-header">
                  <span className={`status-badge ${roadmap.status}`}>
                    {roadmap.status === 'published' ? t('profile:roadmap.published') : t('profile:roadmap.draft')}
                  </span>
                </div>
                
                <h3 className="roadmap-name">{roadmap.name}</h3>
                
                <div className="roadmap-meta">
                  <div className="meta-item">
                    <span className="meta-icon">📋</span>
                    <span className="meta-text">{roadmap.subSkillCount} {t('profile:roadmap.subSkills')}</span>
                  </div>
                  {roadmap.status === 'published' && (
                    <div className="meta-item">
                      <span className="meta-icon">👥</span>
                      <span className="meta-text">{roadmap.studentsCount} {t('profile:roadmap.students')}</span>
                    </div>
                  )}
                </div>

                <div className="roadmap-dates">
                  <p className="date-text">{t('profile:roadmap.created')}: {formatDate(roadmap.createdAt)}</p>
                  <p className="date-text">{t('profile:roadmap.updated')}: {formatDate(roadmap.updatedAt)}</p>
                </div>

                <div className="roadmap-actions">
                  <button
                    className="action-button view-button"
                    onClick={() => handleViewRoadmap(roadmap.id)}
                    title={t('profile:roadmap.viewTitle')}
                  >
                    {t('profile:roadmap.view')}
                  </button>
                  {roadmap.status === 'published' && (
                    <button
                      className="action-button share-button"
                      onClick={(e) => handleShareToFeed(roadmap.id, e)}
                      title={t('profile:roadmap.shareTitle')}
                    >
                      {t('profile:roadmap.share')}
                    </button>
                  )}
                  <button
                    className="action-button edit-button"
                    onClick={() => handleEditRoadmap(roadmap.id)}
                    title={t('profile:roadmap.editTitle')}
                  >
                    {t('profile:roadmap.edit')}
                  </button>
                  <button
                    className="action-button delete-button"
                    onClick={() => handleDeleteRoadmap(roadmap.id)}
                    title={t('profile:roadmap.deleteTitle')}
                  >
                    {t('profile:roadmap.delete')}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      )}

      {activeTab === 'achievements' && (
        <div className="achievements-section">
          <Achievements />
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="timeline-section">
          <SkillTimeline />
        </div>
      )}
    </div>
  );
};

export default Profile;
