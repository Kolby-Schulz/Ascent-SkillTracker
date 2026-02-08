import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import PeakReached from '../components/PeakReached';
import CodePlayground from '../components/CodePlayground';
import { recordCompletedSkill } from '../utils/skillProgress';
import { updateStreak, checkStreakAchievements, checkSkillAchievements, getCompletedSkillsCount, unlockAchievement } from '../utils/achievements';
import './SkillDetail.css';

// Mock data for skills - in the future this will come from the API
const skillsData = {
  guitar: {
    name: 'Guitar',
    description: 'Master the art of playing guitar',
    subSkills: [
      {
        id: 1,
        title: 'Holding the guitar and pick',
        description: 'Learn proper posture and how to hold the guitar and pick correctly',
        order: 1
      },
      {
        id: 2,
        title: 'Tuning the guitar',
        description: 'Understand how to tune your guitar using different methods',
        order: 2
      },
      {
        id: 3,
        title: 'Basic chords',
        description: 'Learn essential chords like C, G, D, Em, Am',
        order: 3
      },
      {
        id: 4,
        title: 'Strumming patterns',
        description: 'Master different strumming patterns and rhythms',
        order: 4
      },
      {
        id: 5,
        title: 'Reading tabs',
        description: 'Learn to read guitar tablature notation',
        order: 5
      },
      {
        id: 6,
        title: 'Rhythm basics',
        description: 'Understand timing, tempo, and rhythmic patterns',
        order: 6
      }
    ]
  },
  'web-development': {
    name: 'Web Development',
    description: 'Build modern web applications',
    subSkills: [
      {
        id: 1,
        title: 'HTML fundamentals',
        description: 'Learn HTML tags, structure, and semantic markup',
        order: 1
      },
      {
        id: 2,
        title: 'CSS styling',
        description: 'Master CSS selectors, layouts, and responsive design',
        order: 2
      },
      {
        id: 3,
        title: 'JavaScript basics',
        description: 'Understand variables, functions, and DOM manipulation',
        order: 3
      },
      {
        id: 4,
        title: 'React fundamentals',
        description: 'Learn components, props, state, and hooks',
        order: 4
      },
      {
        id: 5,
        title: 'Backend with Node.js',
        description: 'Build APIs with Express and Node.js',
        order: 5
      },
      {
        id: 6,
        title: 'Database integration',
        description: 'Work with MongoDB and database operations',
        order: 6
      }
    ]
  },
  photography: {
    name: 'Photography',
    description: 'Capture stunning images',
    subSkills: [
      {
        id: 1,
        title: 'Camera basics',
        description: 'Understand your camera settings and modes',
        order: 1
      },
      {
        id: 2,
        title: 'Exposure triangle',
        description: 'Master aperture, shutter speed, and ISO',
        order: 2
      },
      {
        id: 3,
        title: 'Composition rules',
        description: 'Learn rule of thirds, leading lines, and framing',
        order: 3
      },
      {
        id: 4,
        title: 'Lighting techniques',
        description: 'Work with natural and artificial light',
        order: 4
      },
      {
        id: 5,
        title: 'Photo editing',
        description: 'Edit photos using Lightroom and Photoshop',
        order: 5
      },
      {
        id: 6,
        title: 'Portrait photography',
        description: 'Capture compelling portraits',
        order: 6
      }
    ]
  }
};

const SkillDetail = () => {
  const { skillId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const wasCompletedRef = useRef(false);
  
  // Track completed sub-skills (stored in localStorage per skill)
  const [completedSteps, setCompletedSteps] = useState(() => {
    const saved = localStorage.getItem(`skill-progress-${skillId}`);
    return saved ? JSON.parse(saved) : {};
  });

  const skill = skillsData[skillId];
  const { name, description, subSkills } = skill || {};
  
  // Calculate progress (only if skill exists)
  const completedCount = skill ? Object.values(completedSteps).filter(Boolean).length : 0;
  const totalSteps = skill ? subSkills.length : 0;
  const progressPercentage = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;
  const isSkillMastered = skill && completedCount === totalSteps;

  // Initialize ref based on initial completion state
  useEffect(() => {
    if (skill) {
      wasCompletedRef.current = isSkillMastered;
    }
  }, []); // Only run on mount

  // Detect when skill becomes completed
  useEffect(() => {
    if (skill && isSkillMastered && !wasCompletedRef.current) {
      // Skill just became completed - show celebration and record for metrics (persists even if card removed)
      wasCompletedRef.current = true;
      setShowCelebration(true);
      recordCompletedSkill(skillId);
      
      // Track achievements and streaks
      const userId = user?.id || user?._id || 'default';
      
      // Update streak
      updateStreak(userId);
      
      // Check and unlock achievements after a short delay to ensure localStorage is updated
      setTimeout(() => {
        const completedCount = getCompletedSkillsCount();
        
        // Check and unlock first step achievement (if this is their first completion)
        if (completedCount === 1) {
          unlockAchievement(userId, 'first_step');
        }
        
        // Check skill completion achievements
        checkSkillAchievements(userId, completedCount);
        
        // Check streak achievements
        checkStreakAchievements(userId);
      }, 100);
    } else if (skill && !isSkillMastered) {
      // Skill is not completed - reset flag
      wasCompletedRef.current = false;
    }
  }, [isSkillMastered, skill, skillId, user]);

  if (!skill) {
    return (
      <div className="skill-detail-container">
        <div className="skill-not-found glass-panel">
          <h2>Skill not found</h2>
          <button onClick={() => navigate('/dashboard')} className="back-button">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Toggle step completion
  const toggleStepCompletion = (stepId) => {
    const newCompletedSteps = {
      ...completedSteps,
      [stepId]: !completedSteps[stepId]
    };
    setCompletedSteps(newCompletedSteps);
    localStorage.setItem(`skill-progress-${skillId}`, JSON.stringify(newCompletedSteps));
    
    // Update streak when user completes a step
    const userId = user?.id || user?._id || 'default';
    updateStreak(userId);
    checkStreakAchievements(userId);
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) =>
      prevIndex === subSkills.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? subSkills.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <>
      <PeakReached
        skillName={name}
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
      />
      <motion.div
        className="skill-detail-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
      {/* Header Section */}
      <div className="skill-header">
        <button onClick={() => navigate('/dashboard')} className="back-button">
          ← Back
        </button>
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="skill-title">
            {name}
            {isSkillMastered && <span className="mastered-badge">✓ Mastered!</span>}
          </h1>
          <p className="skill-description">{description}</p>
        </motion.div>
        
        {/* Progress Bar */}
        <motion.div
          className="progress-bar-container"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="progress-bar-header">
            <span className="progress-label">Overall Progress</span>
            <span className="progress-percentage">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="progress-bar-track">
            <motion.div
              className="progress-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, delay: 0.4 }}
            />
          </div>
          <div className="progress-stats">
            <span>{completedCount} of {totalSteps} steps completed</span>
          </div>
        </motion.div>
      </div>

      {/* Sub-skills Carousel */}
      <motion.div
        className="carousel-section glass-panel"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="carousel-title">Learning Path</h2>
        <p className="carousel-subtitle">
          Master these {subSkills.length} essential sub-skills
        </p>

        <div className="carousel-container">
          {/* Navigation Buttons */}
          <button
            className="carousel-button carousel-button-left"
            onClick={prevSlide}
            aria-label="Previous sub-skill"
          >
            ‹
          </button>

          {/* Carousel Content */}
          <div className="carousel-content">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className={`carousel-card ${completedSteps[subSkills[currentIndex].id] ? 'completed' : ''}`}
              >
                <div className="carousel-card-header">
                  <span className="sub-skill-number">
                    Step {subSkills[currentIndex].order}
                  </span>
                  <span className="sub-skill-total">
                    of {subSkills.length}
                  </span>
                </div>
                <h3 className="sub-skill-title">
                  {subSkills[currentIndex].title}
                </h3>
                <p className="sub-skill-description">
                  {subSkills[currentIndex].description}
                </p>
                
                {/* Code Playground for coding-related skills */}
                {(skillId === 'web-development' || skillId.includes('code') || skillId.includes('programming')) && (
                  <div className="code-playground-section">
                    <CodePlayground
                      initialCode="// Try writing some code here!\nconsole.log('Hello, Ascent!');"
                      language="javascript"
                    />
                  </div>
                )}
                
                {/* Checkbox to mark as complete */}
                <div className="step-completion">
                  <label className="completion-checkbox">
                    <input
                      type="checkbox"
                      checked={completedSteps[subSkills[currentIndex].id] || false}
                      onChange={() => toggleStepCompletion(subSkills[currentIndex].id)}
                    />
                    <span className="checkbox-custom"></span>
                    <span className="checkbox-label">
                      {completedSteps[subSkills[currentIndex].id] ? 'Completed ✓' : 'Mark as complete'}
                    </span>
                  </label>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            className="carousel-button carousel-button-right"
            onClick={nextSlide}
            aria-label="Next sub-skill"
          >
            ›
          </button>
        </div>

        {/* Carousel Indicators */}
        <div className="carousel-indicators">
          {subSkills.map((subSkill, index) => (
            <button
              key={index}
              className={`indicator ${index === currentIndex ? 'active' : ''} ${completedSteps[subSkill.id] ? 'completed' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to sub-skill ${index + 1}`}
              title={completedSteps[subSkill.id] ? 'Completed' : 'Not completed'}
            />
          ))}
        </div>

        {/* Progress Info */}
        <div className="progress-info">
          <p>
            Viewing sub-skill {currentIndex + 1} of {subSkills.length}
          </p>
        </div>
      </motion.div>
    </motion.div>
    </>
  );
};

export default SkillDetail;
