import React from 'react';
import { motion } from 'framer-motion';
import './RoadmapView.css';

const RoadmapView = ({ skill, onClose }) => {
  // Mock roadmap data - in real app, this would come from API
  const roadmapSteps = [
    { id: 1, title: 'Get Started', description: 'Learn the basics and fundamentals', completed: true },
    { id: 2, title: 'Practice Basics', description: 'Daily practice routine', completed: true },
    { id: 3, title: 'Intermediate Level', description: 'Build on your foundation', completed: false },
    { id: 4, title: 'Advanced Techniques', description: 'Master complex concepts', completed: false },
    { id: 5, title: 'Expert Level', description: 'Become a master', completed: false },
  ];

  return (
    <motion.div
      className="roadmap-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="roadmap-container"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="roadmap-header">
          <h2 className="roadmap-title">{skill} Roadmap</h2>
          <button className="roadmap-close" onClick={onClose}>×</button>
        </div>
        
        <div className="roadmap-steps">
          {roadmapSteps.map((step, index) => (
            <motion.div
              key={step.id}
              className={`roadmap-step ${step.completed ? 'completed' : ''}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="step-number">{step.id}</div>
              <div className="step-content">
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
              {step.completed && <span className="step-check">✓</span>}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RoadmapView;
