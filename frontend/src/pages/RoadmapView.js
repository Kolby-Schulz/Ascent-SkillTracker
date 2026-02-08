import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PeakReached from '../components/PeakReached';
import MountainProgress from '../components/MountainProgress';
import roadmapService from '../services/roadmapService';
import { recordCompletedRoadmap } from '../utils/skillProgress';
import { useSkills } from '../context/SkillsContext';
import './SkillDetail.css';

const RoadmapView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addSkill, skills } = useSkills();
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
        let data = null;
        try {
          const res = await roadmapService.getRoadmapById(id);
          data = res?.data ?? res;
        } catch (firstErr) {
          // If first attempt failed and user is logged in, try owner endpoint (for drafts)
          if (localStorage.getItem('token')) {
            try {
              const res = await roadmapService.getMyRoadmapForView(id);
              data = res?.data ?? res;
            } catch (e) {
              throw firstErr;
            }
          } else {
            throw firstErr;
          }
        }
        if (data) setRoadmap(data);
        else setError('Failed to load roadmap');
      } catch (err) {
        const msg = err?.error || err?.message || err?.response?.data?.error || 'Failed to load roadmap';
        setError(msg);
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
  const isInMySkills = roadmap && skills.includes(roadmap.name);

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
    if (!isInMySkills) return;
    const key = String(stepIndex);
    const next = { ...completedSteps, [key]: !completedSteps[key] };
    setCompletedSteps(next);
    if (id) localStorage.setItem(`roadmap-progress-${id}`, JSON.stringify(next));
  };

  if (sortedSubSkills.length === 0) {
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
          <div className="skill-header-top">
            <button onClick={() => navigate(-1)} className="back-button">
              ← Back
            </button>
          </div>
          <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <h1 className="skill-title">
              {roadmap.name}
              {isSkillMastered && <span className="mastered-badge">✓ Mastered!</span>}
            </h1>
            <p className="skill-description">
              {roadmap.description || 'A learning path created by the community'}
            </p>
          </motion.div>

          {/* Add to My Skills - near progress bar; required to check off steps */}
          <div className="skill-header-actions">
            <motion.button
              type="button"
              className="add-to-my-skills-button"
              onClick={async () => {
                addSkill(roadmap.name, id);
                try {
                  await roadmapService.addLearner(id);
                } catch {
                  // e.g. not logged in or already a learner
                }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
            >
              {isInMySkills ? 'In My Skills' : 'Add to My Skills'}
            </motion.button>
          </div>

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
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <MountainProgress
            steps={sortedSubSkills.map((step, index) => ({
              ...step,
              index
            }))}
            completedSteps={completedSteps}
            currentStepIndex={currentIndex}
            onStepClick={(index) => {
              setCurrentIndex(index);
              setDirection(index > currentIndex ? 1 : -1);
            }}
            onStepComplete={(index) => {
              toggleStepCompletion(index);
            }}
          />
          
          {/* Step detail view */}
          {sortedSubSkills[currentIndex] && (
            <motion.div
              className="step-detail-panel glass-panel"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="step-detail-header">
                <span className="step-detail-number">
                  Step {sortedSubSkills[currentIndex].order || currentIndex + 1} of {sortedSubSkills.length}
                </span>
                {completedSteps[String(currentIndex)] && (
                  <span className="step-detail-completed">✓ Completed</span>
                )}
              </div>
              <h3 className="step-detail-title">{sortedSubSkills[currentIndex].title}</h3>
              <p className="step-detail-description">{sortedSubSkills[currentIndex].description}</p>
              
              {(sortedSubSkills[currentIndex].resources || []).length > 0 && (
                <div className="step-detail-resources">
                  <span className="step-detail-resources-label">Resources</span>
                  <ul className="step-detail-resources-list">
                    {(sortedSubSkills[currentIndex].resources || []).map((res, i) => (
                      <li key={i}>
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="step-detail-resource-link"
                        >
                          {res.title || res.url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="step-detail-completion">
                {isInMySkills ? (
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
                ) : (
                  <p className="step-completion-locked">Add this guide to My Skills to check off steps.</p>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </>
  );
};

export default RoadmapView;
