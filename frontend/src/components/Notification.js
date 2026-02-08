import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Notification.css';

const Notification = ({ message, type = 'success', isVisible, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`notification notification-${type}`}
          initial={{ opacity: 0, y: -50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -50, x: '-50%' }}
          transition={{ duration: 0.3 }}
        >
          <div className="notification-content">
            <span className="notification-icon">
              {type === 'success' && '✓'}
              {type === 'error' && '✕'}
              {type === 'info' && 'ℹ'}
            </span>
            <span className="notification-message">{message}</span>
            <button className="notification-close" onClick={onClose}>
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
