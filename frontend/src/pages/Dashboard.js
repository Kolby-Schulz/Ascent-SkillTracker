import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const SIDEBAR_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { id: 'learnc', label: 'Learnc', icon: 'book' },
  { id: 'saved', label: 'Saved', icon: 'bookmark' },
  { id: 'feed', label: 'Feed', icon: 'feed' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

// Map skill names to their URL-friendly IDs
const SKILL_ID_MAP = {
  'Guitar': 'guitar',
  'Fishing': 'fishing',
  'Singing': 'singing',
  'Web Development': 'web-development',
  'Photography': 'photography',
  'Cooking': 'cooking',
};

const INITIAL_SKILLS = ['Guitar', 'Web Development', 'Photography'];

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
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('dashboard');
  const [skills, setSkills] = useState(INITIAL_SKILLS);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [suggestedSkills] = useState(() => getRandomSuggestedSkills());
  const profileRef = useRef(null);

  const userDisplayName = user?.username || user?.email?.split('@')[0] || 'User';

  const handleSkillClick = (skillName) => {
    const skillId = SKILL_ID_MAP[skillName] || skillName.toLowerCase().replace(/\s+/g, '-');
    navigate(`/skill/${skillId}`);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDragStart = useCallback((e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index);
    e.target.style.opacity = '0.5';
  }, []);

  const handleDragEnd = useCallback((e) => {
    e.target.style.opacity = '1';
    setDraggedIndex(null);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (dragIndex === dropIndex || isNaN(dragIndex)) return;

    setSkills((prev) => {
      const newSkills = [...prev];
      const [removed] = newSkills.splice(dragIndex, 1);
      newSkills.splice(dropIndex, 0, removed);
      return newSkills;
    });
  }, []);

  return (
    <div className="dashboard-layout">
      {/* Left Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <div className="logo-shapes">
            <span className="logo-square" />
            <span className="logo-circle" />
            <span className="logo-triangle" />
          </div>
        </div>
        <nav className="sidebar-nav">
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`sidebar-nav-item ${activeNav === item.id ? 'active' : ''}`}
              onClick={() => setActiveNav(item.id)}
            >
              <span className="nav-icon">{item.label.charAt(0)}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="main-header">
          <h1 className="greeting">Hello, {userDisplayName}</h1>
        </div>

        <div className="skills-section">
          <h2 className="skills-title">Your Skills</h2>
          <div className="skills-grid">
            {skills.map((skill, index) => (
              <motion.div
                key={`${skill}-${index}`}
                className={`skill-card ${draggedIndex === index ? 'dragging' : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
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
                  <span className="skill-drag-hint">Click to view • Drag to reorder</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="dashboard-right-sidebar">
        <div className="profile-area" ref={profileRef}>
          <div className="profile-wrapper">
            <button
              className="profile-avatar"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              aria-label="Open settings"
            >
              <div className="avatar-placeholder">
                {userDisplayName.charAt(0).toUpperCase()}
              </div>
            </button>
            {profileMenuOpen && (
              <div className="profile-dropdown glass-panel">
                <button className="dropdown-item">Settings</button>
                <button className="dropdown-item" onClick={logout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="suggested-skills-panel glass-panel">
          <h3 className="panel-title">Suggested Related Skills</h3>
          <ul className="suggested-skills-list">
            {suggestedSkills.map((skill, index) => (
              <li key={skill} className="suggested-skill-item">
                <span className="skill-dot" style={{ background: `hsl(${(index * 60) % 360}, 60%, 55%)` }} />
                <span>{skill}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Dashboard;
