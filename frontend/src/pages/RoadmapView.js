import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PeakReached from '../components/PeakReached';
import roadmapService from '../services/roadmapService';
import { recordCompletedRoadmap } from '../utils/skillProgress';
import './SkillDetail.css';

const RoadmapView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const wasCompletedRef = useRef(false);

  // Step completion (persisted per roadmap in localStorage)
  const [completedSteps, setCompletedSteps] = useState(() => {
    if (!id) return {};
    const saved = localStorage.getItem(`roadmap-progress-${id}`);
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    const fetchRoadmap = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await roadmapService.getRoadmapById(id);
        const data = res.data ?? res;
        setRoadmap(data);
      } catch (err) {
        setError(err.message || 'Failed to load roadmap');
        setRoadmap(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchRoadmap();
  }, [id]);

  // Rehydrate completedSteps from localStorage when id changes
  useEffect(() => {
    if (id) {
      const saved = localStorage.getItem(`roadmap-progress-${id}`);
      setCompletedSteps(saved ? JSON.parse(saved) : {});
    }
  }, [id]);

  // Derived values (safe when roadmap is null)
  const subSkills = roadmap?.subSkills || [];
  const sortedSubSkills = [...subSkills].sort((a, b) => (a.order || 0) - (b.order || 0));
  const totalSteps = sortedSubSkills.length;
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercentage = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;
  const isSkillMastered = totalSteps > 0 && completedCount === totalSteps;

  useEffect(() => {
    if (roadmap && totalSteps > 0) {
      wasCompletedRef.current = isSkillMastered;
    }
  }, []);

  useEffect(() => {
    if (roadmap && totalSteps > 0 && isSkillMastered && !wasCompletedRef.current) {
      wasCompletedRef.current = true;
      setShowCelebration(true);
      recordCompletedRoadmap(id);
    } else if (roadmap && totalSteps > 0 && !isSkillMastered) {
      wasCompletedRef.current = false;
    }
  }, [isSkillMastered, roadmap, totalSteps, id]);

  // Persist roadmap step count so metrics can count completed roadmaps
  useEffect(() => {
    if (id && totalSteps > 0) {
      localStorage.setItem(`roadmap-total-steps-${id}`, String(totalSteps));
    }
  }, [id, totalSteps]);

  if (loading) {
    return (
      <div className="skill-detail-container">
        <div className="skill-header">
          <button onClick={() => navigate(-1)} className="back-button">
            ← Back
          </button>
          <p className="skill-description">Loading roadmap...</p>
        </div>
      </div>
    );
  }

  if (error || !roadmap) {
    return (
      <div className="skill-detail-container">
        <div className="skill-not-found glass-panel">
          <h2>{error || 'Roadmap not found'}</h2>
          <button onClick={() => navigate('/dashboard')} className="back-button">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const toggleStepCompletion = (stepIndex) => {
    const key = String(stepIndex);
    const next = { ...completedSteps, [key]: !completedSteps[key] };
    setCompletedSteps(next);
    if (id) localStorage.setItem(`roadmap-progress-${id}`, JSON.stringify(next));
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) =>
      prev === sortedSubSkills.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) =>
      prev === 0 ? sortedSubSkills.length - 1 : prev - 1
    );
  };

  const goToSlide = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const variants = {
    enter: (d) => ({ x: d > 0 ? 1000 : -1000, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (d) => ({ zIndex: 0, x: d < 0 ? 1000 : -1000, opacity: 0 }),
  };

  const current = sortedSubSkills[currentIndex];
  if (!current) {
    return (
      <div className="skill-detail-container">
        <div className="skill-header">
          <button onClick={() => navigate(-1)} className="back-button">
            ← Back
          </button>
          <h1 className="skill-title">{roadmap.name}</h1>
          <p className="skill-description">No steps in this roadmap yet.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PeakReached
        skillName={roadmap.name}
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
      />
      <motion.div
        className="skill-detail-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="skill-header">
          <button onClick={() => navigate(-1)} className="back-button">
            ← Back
          </button>
          <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <h1 className="skill-title">
              {roadmap.name}
              {isSkillMastered && <span className="mastered-badge">✓ Mastered!</span>}
            </h1>
            <p className="skill-description">
              {roadmap.description || 'A learning path created by the community'}
            </p>
          </motion.div>

          {/* Progress Bar - same as SkillDetail */}
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

        <motion.div
          className="carousel-section glass-panel"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="carousel-title">Learning Path</h2>
          <p className="carousel-subtitle">
            Master these {sortedSubSkills.length} essential sub-skills
          </p>

          <div className="carousel-container">
            <button
              className="carousel-button carousel-button-left"
              onClick={prevSlide}
              aria-label="Previous"
            >
              ‹
            </button>

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
                    opacity: { duration: 0.2 },
                  }}
                  className={`carousel-card ${completedSteps[String(currentIndex)] ? 'completed' : ''}`}
                >
                  <div className="carousel-card-header">
                    <span className="sub-skill-number">
                      Step {current.order || currentIndex + 1}
                    </span>
                    <span className="sub-skill-total">of {sortedSubSkills.length}</span>
                  </div>
                  <h3 className="sub-skill-title">{current.title}</h3>
                  <p className="sub-skill-description">{current.description}</p>
                  {current.customContent && (
                    <div className="sub-skill-extra">
                      {current.customContent}
                    </div>
                  )}
                  {(current.resources || []).length > 0 && (
                    <div className="sub-skill-resources">
                      <span className="sub-skill-resources-label">Resources</span>
                      <ul className="sub-skill-resources-list">
                        {(current.resources || []).map((res, i) => (
                          <li key={i}>
                            <a
                              href={res.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="sub-skill-resource-link"
                            >
                              {res.title || res.url}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="step-completion">
                    <label className="completion-checkbox">
                      <input
                        type="checkbox"
                        checked={!!completedSteps[String(currentIndex)]}
                        onChange={() => toggleStepCompletion(currentIndex)}
                      />
                      <span className="checkbox-custom" />
                      <span className="checkbox-label">
                        {completedSteps[String(currentIndex)] ? 'Completed ✓' : 'Mark as complete'}
                      </span>
                    </label>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              className="carousel-button carousel-button-right"
              onClick={nextSlide}
              aria-label="Next"
            >
              ›
            </button>
          </div>

          <div className="carousel-indicators">
            {sortedSubSkills.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentIndex ? 'active' : ''} ${completedSteps[String(index)] ? 'completed' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Step ${index + 1}`}
                title={completedSteps[String(index)] ? 'Completed' : 'Not completed'}
              />
            ))}
          </div>

          <div className="progress-info">
            <p>
              Viewing sub-skill {currentIndex + 1} of {sortedSubSkills.length}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default RoadmapView;
