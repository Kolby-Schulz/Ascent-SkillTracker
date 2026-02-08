import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import roadmapService from '../services/roadmapService';
import postService from '../services/postService';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [roadmaps, setRoadmaps] = useState([]);
  const [filter, setFilter] = useState('all'); // all, published, draft
  const [loading, setLoading] = useState(false);

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
    const caption = window.prompt('Add a caption (optional):');
    if (caption === null) return; // User cancelled

    try {
      await postService.createPost(roadmapId, caption || '');
      alert('Roadmap shared to feed!');
    } catch (error) {
      console.error('Error sharing to feed:', error);
      alert(error.response?.data?.error || 'Failed to share roadmap. Make sure it is published.');
    }
  };

  const handleDeleteRoadmap = async (roadmapId) => {
    if (window.confirm('Are you sure you want to delete this roadmap?')) {
      try {
        await roadmapService.deleteRoadmap(roadmapId);
        setRoadmaps(roadmaps.filter(r => r.id !== roadmapId));
        alert('Roadmap deleted successfully!');
      } catch (error) {
        console.error('Error deleting roadmap:', error);
        alert(error.error || 'Failed to delete roadmap. Please try again.');
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
              {roadmaps.length} roadmap{roadmaps.length !== 1 ? 's' : ''} created
              {' • '}
              {roadmaps.reduce((sum, r) => sum + r.studentsCount, 0)} total students
            </p>
          </div>
        </div>
        <button className="create-new-button" onClick={handleCreateNew}>
          Create New Roadmap
        </button>
      </motion.div>

      <div className="roadmaps-section">
        <div className="section-header">
          <h2 className="section-title">My Created Roadmaps</h2>
          <div className="filter-buttons">
            <button
              className={`filter-button ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({roadmaps.length})
            </button>
            <button
              className={`filter-button ${filter === 'published' ? 'active' : ''}`}
              onClick={() => setFilter('published')}
            >
              Published ({roadmaps.filter(r => r.status === 'published').length})
            </button>
            <button
              className={`filter-button ${filter === 'draft' ? 'active' : ''}`}
              onClick={() => setFilter('draft')}
            >
              Drafts ({roadmaps.filter(r => r.status === 'draft').length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your roadmaps...</p>
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
                ? "You haven't created any roadmaps yet"
                : `No ${filter} roadmaps`
              }
            </h3>
            <p className="empty-description">
              {filter === 'all'
                ? 'Start creating custom learning paths to help others learn new skills'
                : `You don't have any ${filter} roadmaps at the moment`
              }
            </p>
            {filter === 'all' && (
              <button className="empty-cta-button" onClick={handleCreateNew}>
                Create Your First Roadmap
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
                    {roadmap.status === 'published' ? '✓ Published' : '📝 Draft'}
                  </span>
                </div>
                
                <h3 className="roadmap-name">{roadmap.name}</h3>
                
                <div className="roadmap-meta">
                  <div className="meta-item">
                    <span className="meta-icon">📋</span>
                    <span className="meta-text">{roadmap.subSkillCount} sub-skills</span>
                  </div>
                  {roadmap.status === 'published' && (
                    <div className="meta-item">
                      <span className="meta-icon">👥</span>
                      <span className="meta-text">{roadmap.studentsCount} students</span>
                    </div>
                  )}
                </div>

                <div className="roadmap-dates">
                  <p className="date-text">Created: {formatDate(roadmap.createdAt)}</p>
                  <p className="date-text">Updated: {formatDate(roadmap.updatedAt)}</p>
                </div>

                <div className="roadmap-actions">
                  <button
                    className="action-button view-button"
                    onClick={() => handleViewRoadmap(roadmap.id)}
                    title="View roadmap"
                  >
                    👁️ View
                  </button>
                  {roadmap.status === 'published' && (
                    <button
                      className="action-button share-button"
                      onClick={(e) => handleShareToFeed(roadmap.id, e)}
                      title="Share to feed"
                    >
                      📤 Share
                    </button>
                  )}
                  <button
                    className="action-button edit-button"
                    onClick={() => handleEditRoadmap(roadmap.id)}
                    title="Edit roadmap"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="action-button delete-button"
                    onClick={() => handleDeleteRoadmap(roadmap.id)}
                    title="Delete roadmap"
                  >
                    🗑️
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
