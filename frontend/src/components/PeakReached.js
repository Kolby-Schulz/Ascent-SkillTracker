import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './PeakReached.css';

const PeakReached = ({ skillName, onClose, isOpen }) => {
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    if (isOpen) {
      // Generate confetti particles
      const particles = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 2,
        size: 8 + Math.random() * 12,
        color: ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4', '#95E1D3', '#F38181', '#AA96DA', '#D9BBA3'][Math.floor(Math.random() * 8)],
      }));
      setConfetti(particles);

      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="peak-reached-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Confetti */}
          <div className="confetti-container">
            {confetti.map((particle) => (
              <div
                key={particle.id}
                className="confetti-particle"
                style={{
                  left: `${particle.left}%`,
                  '--delay': `${particle.delay}s`,
                  '--duration': `${particle.duration}s`,
                  '--size': `${particle.size}px`,
                  '--color': particle.color,
                }}
              />
            ))}
          </div>

          {/* Celebration Content */}
          <motion.div
            className="peak-reached-content"
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 50 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 20,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mountain Icon */}
            <motion.div
              className="mountain-icon"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.2,
                type: 'spring',
                stiffness: 200,
                damping: 15,
              }}
            >
              <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M100 20 L20 180 L180 180 Z"
                  fill="url(#mountainGradient)"
                  stroke="#D9BBA3"
                  strokeWidth="3"
                />
                <defs>
                  <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFD700" />
                    <stop offset="50%" stopColor="#FFA500" />
                    <stop offset="100%" stopColor="#D9BBA3" />
                  </linearGradient>
                </defs>
                {/* Flag at peak */}
                <motion.path
                  d="M100 20 L100 40 L110 35 L100 30 Z"
                  fill="#FF6B6B"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                />
              </svg>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="peak-reached-title"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Peak Reached!
            </motion.h1>

            {/* Skill Name */}
            <motion.p
              className="peak-reached-skill"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              You've conquered {skillName}!
            </motion.p>

            {/* Message */}
            <motion.p
              className="peak-reached-message"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              You've reached the summit and mastered this skill. Well done!
            </motion.p>

            {/* Close Button */}
            <motion.button
              className="peak-reached-button"
              onClick={onClose}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: 'spring' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continue Journey
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PeakReached;
