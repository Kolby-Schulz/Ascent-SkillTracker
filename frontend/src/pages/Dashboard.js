import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useSkills } from '../context/SkillsContext';
import './Dashboard.css';

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
  const { user } = useAuth();
  const { skills, removeSkill, reorderSkills } = useSkills();
  const [draggedIndex, setDraggedIndex] = useState(null);

  const userDisplayName = user?.username || user?.email?.split('@')[0] || 'User';

  const handleDragStart = useCallback((e, index) => {
    // Only allow drag from a specific drag handle area
    if (!e.target.classList.contains('skill-drag-handle') && !e.target.closest('.skill-drag-handle')) {
      e.preventDefault();
      return;
    }
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index);
    e.target.closest('.skill-card').style.opacity = '0.5';
  }, []);

  const handleDragEnd = useCallback((e) => {
    const card = e.target.closest('.skill-card');
    if (card) {
      card.style.opacity = '1';
    }
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

    const newSkills = [...skills];
    const [removed] = newSkills.splice(dragIndex, 1);
    newSkills.splice(dropIndex, 0, removed);
    reorderSkills(newSkills);
  }, []);

  const handleRemoveSkill = (skillToRemove, e) => {
    e.stopPropagation();
    removeSkill(skillToRemove);
  };

  return (
    <>
      <div className="dashboard-content">
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="skill-card-content">
                  <span className="skill-icon">🎯</span>
                  <span className="skill-name">{skill}</span>
                  <div className="skill-actions">
                    <span className="skill-drag-hint">Drag to reorder</span>
                    <div className="skill-buttons">
                      <span className="skill-drag-handle" title="Drag to reorder">⋮⋮</span>
                      <button
                        className="skill-remove"
                        onClick={(e) => handleRemoveSkill(skill, e)}
                        title="Remove skill"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
