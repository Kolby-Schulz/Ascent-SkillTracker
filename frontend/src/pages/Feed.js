import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import postService from '../services/postService';
import './Feed.css';

const Feed = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    setLoading(true);
    try {
      const response = await postService.getFeed();
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('Error loading feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await postService.toggleLike(postId);
      // Update post in state
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                isLiked: response.data.isLiked,
                likesCount: response.data.likesCount,
              }
            : post
        )
      );
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleRoadmapClick = (roadmapId) => {
    navigate(`/roadmap/${roadmapId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      className="feed-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="feed-header">
        <h1 className="feed-title">Feed</h1>
        <p className="feed-subtitle">See what your friends are learning</p>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading feed...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3 className="empty-title">No posts yet</h3>
          <p className="empty-description">
            When your friends share their roadmaps, they'll appear here
          </p>
        </div>
      ) : (
        <div className="feed-posts">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              className="feed-post glass-panel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="post-header">
                <div className="post-author">
                  <div className="author-avatar">
                    {post.author.profilePicture ? (
                      <img src={post.author.profilePicture} alt={post.author.username} />
                    ) : (
                      <div className="avatar-placeholder">
                        {post.author.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="author-info">
                    <h3 className="author-username">{post.author.username}</h3>
                    <p className="post-time">{formatDate(post.createdAt)}</p>
                  </div>
                </div>
              </div>

              <div
                className="post-roadmap"
                onClick={() => handleRoadmapClick(post.roadmap._id)}
              >
                <h3 className="roadmap-name">{post.roadmap.name}</h3>
                {post.roadmap.description && (
                  <p className="roadmap-description">{post.roadmap.description}</p>
                )}
                <div className="roadmap-meta">
                  <span className="meta-item">
                    📋 {post.roadmap.subSkillCount} sub-skills
                  </span>
                  {post.roadmap.category && (
                    <span className="meta-item">🏷️ {post.roadmap.category}</span>
                  )}
                </div>
              </div>

              {post.caption && <p className="post-caption">{post.caption}</p>}

              <div className="post-actions">
                <button
                  className={`like-button ${post.isLiked ? 'liked' : ''}`}
                  onClick={() => handleLike(post.id)}
                >
                  {post.isLiked ? '❤️' : '🤍'} {post.likesCount}
                </button>
                <button
                  className="view-button"
                  onClick={() => handleRoadmapClick(post.roadmap._id)}
                >
                  View Roadmap →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Feed;
