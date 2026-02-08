import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSkills } from '../context/SkillsContext';
import './LearnSkill.css';

const INTEREST_CATEGORIES = [
  'All',
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
];

const MOCK_SKILL_PATHS = [
  { id: 1, name: 'Learn Guitar', category: 'Music', creator: 'Ascent Team', difficulty: 'Beginner', students: 1250 },
  { id: 2, name: 'Master Spanish', category: 'Languages', creator: 'Maria G.', difficulty: 'Intermediate', students: 890 },
  { id: 3, name: 'Web Development', category: 'Technology', creator: 'Ascent Team', difficulty: 'Beginner', students: 2100 },
  { id: 4, name: 'Photography Basics', category: 'Photography', creator: 'John D.', difficulty: 'Beginner', students: 650 },
  { id: 5, name: 'Yoga Fundamentals', category: 'Fitness', creator: 'Ascent Team', difficulty: 'Beginner', students: 430 },
  { id: 6, name: 'Creative Writing', category: 'Writing', creator: 'Sarah L.', difficulty: 'Intermediate', students: 320 },
  { id: 7, name: 'Italian Language', category: 'Languages', creator: 'Ascent Team', difficulty: 'Beginner', students: 560 },
  { id: 8, name: 'Data Science', category: 'Technology', creator: 'Tech Pro', difficulty: 'Advanced', students: 780 },
  { id: 9, name: 'Baking Mastery', category: 'Cooking', creator: 'Chef Mike', difficulty: 'Intermediate', students: 450 },
  { id: 10, name: 'Digital Art', category: 'Arts & Crafts', creator: 'Ascent Team', difficulty: 'Beginner', students: 920 },
  { id: 11, name: 'Running 5K', category: 'Fitness', creator: 'Coach Alex', difficulty: 'Beginner', students: 670 },
  { id: 12, name: 'Business Strategy', category: 'Business', creator: 'Ascent Team', difficulty: 'Advanced', students: 340 },
];

const LearnSkill = () => {
  const { addSkill } = useSkills();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSkills = MOCK_SKILL_PATHS.filter(skill => {
    const matchesCategory = selectedCategory === 'All' || skill.category === selectedCategory;
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddSkill = (skill) => {
    addSkill(skill.name);
    // Navigate back to dashboard after adding
    navigate('/dashboard');
  };

  return (
    <div className="learn-skill-page">
      <div className="learn-skill-header">
        <h1 className="learn-skill-title">Browse Skill Paths</h1>
        <p className="learn-skill-subtitle">Discover skills created by our community and the Ascent team</p>
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

        <div className="category-filters">
          {INTEREST_CATEGORIES.map((category) => (
            <button
              key={category}
              className={`category-filter ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="learn-skill-card-header">
                <span className="learn-skill-category">{skill.category}</span>
                <span className="learn-skill-difficulty">{skill.difficulty}</span>
              </div>
              <h3 className="learn-skill-name">{skill.name}</h3>
              <div className="learn-skill-meta">
                <span className="learn-skill-creator">By {skill.creator}</span>
                <span className="learn-skill-students">{skill.students.toLocaleString()} students</span>
              </div>
              <motion.button
                className="learn-skill-add-button"
                onClick={() => handleAddSkill(skill)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add to My Skills
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearnSkill;
