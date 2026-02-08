import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSkills } from '../context/SkillsContext';
import roadmapService from '../services/roadmapService';
import userSkillService from '../services/userSkillService';
import './LearnSkill.css';

const TAG_OPTIONS = [
  'Music',
  'Sports',
  'Arts & Crafts',
  'Languages',
  'Technology',
  'Cooking',
  'Fitness',
  'Photography',
  'Writing',
  'Business',
  'Science',
  'General',
];

const LearnSkill = () => {
  const { addSkill, skills } = useSkills();
  const navigate = useNavigate();
  const [selectedTag, setSelectedTag] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [publishedRoadmaps, setPublishedRoadmaps] = useState([]);
  const [loadingRoadmaps, setLoadingRoadmaps] = useState(true);

  useEffect(() => {
    const fetchPublished = async () => {
      setLoadingRoadmaps(true);
      try {
        const res = await roadmapService.getRoadmaps({});
        // API returns { success: true, data: [...] } or { data: [...] }
        const list = Array.isArray(res.data?.data) ? res.data.data : 
                     Array.isArray(res.data) ? res.data : [];
        setPublishedRoadmaps(
          list.map((r) => ({
            id: r._id,
            name: r.name,
            category: r.category || 'General',
            tag: (r.tags && r.tags[0]) ? r.tags[0] : '',
            creator: r.creator?.email?.split('@')[0] || r.creator?.username || 'Community',
            difficulty: 'Beginner',
            likesCount: r.likesCount ?? 0,
            isLiked: r.isLiked ?? false,
          }))
        );
      } catch {
        setPublishedRoadmaps([]);
      } finally {
        setLoadingRoadmaps(false);
      }
    };
    fetchPublished();
  }, []);

  const filteredSkills = publishedRoadmaps.filter((skill) => {
    const matchesTag = selectedTag === 'All' || skill.tag === selectedTag;
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const handleViewSkill = (skill) => {
    navigate(`/roadmap/${skill.id}`);
  };

  const handleAddSkill = async (e, skill) => {
    e.stopPropagation();
    addSkill(skill.name, skill.id);
    try {
      await roadmapService.addLearner(skill.id);
      await userSkillService.upsertSkill(skill.name, 'in_progress');
    } catch {
      // e.g. not logged in or already a learner; local add still applies
    }
    if (!skills.includes(skill.name)) navigate('/dashboard');
  };

  const handleLike = async (e, skill) => {
    e.stopPropagation();
    try {
      const res = await roadmapService.likeRoadmap(skill.id);
      setPublishedRoadmaps((prev) =>
        prev.map((s) =>
          s.id === skill.id
            ? {
                ...s,
                likesCount: res?.data?.likesCount ?? s.likesCount + (s.isLiked ? -1 : 1),
                isLiked: res?.data?.liked ?? !s.isLiked,
              }
            : s
        )
      );
    } catch {
      // e.g. 401: not logged in; keep UI as-is
    }
  };

  return (
    <div className="learn-skill-page">
      <div className="learn-skill-header">
        <h1 className="learn-skill-title">Browse Skills</h1>
        <p className="learn-skill-subtitle">Discover guides created by our community.</p>
      </div>

      <div className="learn-skill-filters">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="skill-search-input"
          />
        </div>

        <div className="tag-filters">
          <span className="tag-filters-label">Tag:</span>
          <button
            className={`tag-filter ${selectedTag === 'All' ? 'active' : ''}`}
            onClick={() => setSelectedTag('All')}
          >
            All
          </button>
          {TAG_OPTIONS.map((t) => (
            <button
              key={t}
              className={`tag-filter ${selectedTag === t ? 'active' : ''}`}
              onClick={() => setSelectedTag(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="skills-grid-container">
        <div className="skills-count">
          {filteredSkills.length} skill path{filteredSkills.length !== 1 ? 's' : ''} found
        </div>
        <div className="learn-skills-grid">
          {filteredSkills.map((skill, index) => (
            <motion.div
              key={skill.id}
              className="learn-skill-card"
              role="button"
              tabIndex={0}
              onClick={() => handleViewSkill(skill)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleViewSkill(skill);
                }
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, y: -5 }}
              style={{ cursor: 'pointer' }}
            >
              <div className="learn-skill-card-header">
                <div className="learn-skill-name-wrap">
                  <h3 className="learn-skill-name">{skill.name}</h3>
                  {skill.tag && (
                    <span className="learn-skill-tag">{skill.tag}</span>
                  )}
                </div>
                <button
                  type="button"
                  className={`learn-skill-like-btn ${skill.isLiked ? 'liked' : ''}`}
                  onClick={(e) => handleLike(e, skill)}
                  aria-label={skill.isLiked ? 'Unlike' : 'Like'}
                  title={skill.isLiked ? 'Unlike' : 'Like'}
                >
                  <span className="learn-skill-like-icon">👍</span>
                  <span className="learn-skill-like-count">{skill.likesCount}</span>
                </button>
              </div>
              <div className="learn-skill-meta">
                <span className="learn-skill-creator">By {skill.creator}</span>
              </div>
              <motion.button
                type="button"
                className={`add-to-my-skills-button ${skills.includes(skill.name) ? 'in-my-skills' : ''}`}
                onClick={(e) => handleAddSkill(e, skill)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {skills.includes(skill.name) ? 'In My Skills' : 'Add to My Skills'}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearnSkill;
