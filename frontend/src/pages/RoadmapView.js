import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import roadmapService from '../services/roadmapService';
import './SkillDetail.css';

const RoadmapView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

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

  const subSkills = roadmap.subSkills || [];
  const sortedSubSkills = [...subSkills].sort((a, b) => (a.order || 0) - (b.order || 0));

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
          <h1 className="skill-title">{roadmap.name}</h1>
          <p className="skill-description">
            {roadmap.description || 'A learning path created by the community'}
          </p>
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
          {sortedSubSkills.length} step{sortedSubSkills.length !== 1 ? 's' : ''}
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
                className="carousel-card"
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
                  <div className="sub-skill-extra" style={{ marginTop: 16, opacity: 0.9 }}>
                    {current.customContent}
                  </div>
                )}
                {(current.resources || []).length > 0 && (
                  <div style={{ marginTop: 20 }}>
                    <strong>Resources:</strong>
                    <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                      {(current.resources || []).map((res, i) => (
                        <li key={i}>
                          <a
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#D9BBA3' }}
                          >
                            {res.title || res.url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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
              className={`indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Step ${index + 1}`}
            />
          ))}
        </div>

        <div className="progress-info">
          <p>
            Step {currentIndex + 1} of {sortedSubSkills.length}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RoadmapView;
