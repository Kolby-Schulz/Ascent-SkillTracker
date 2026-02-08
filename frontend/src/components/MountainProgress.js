import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import './MountainProgress.css';

const MountainProgress = ({ 
  steps = [], 
  completedSteps = {}, 
  currentStepIndex = 0,
  onStepClick = () => {},
  onStepComplete = () => {},
  friendProgress = [],
  onResetProgress = null
}) => {
  const clickTimeouts = useRef({});
  const totalSteps = steps.length;
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercentage = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;
  
  // Calculate climber position based on progress (matching step positions)
  const progressRatio = progressPercentage / 100;
  const climberX = 15 + progressRatio * 70; // 15% to 85% horizontally
  const curveFactor = Math.sin(progressRatio * Math.PI / 2); // Ease-in curve
  const climberY = 75 - curveFactor * 60; // 75% to 15% vertically
  
  // Mountain image path
  const mountainImage = process.env.PUBLIC_URL + '/images/6229893.jpg';
  
  // Calculate step positions along the mountain path (curved trail)
  const getStepPosition = (index) => {
    const progress = index / (totalSteps - 1 || 1); // 0 to 1
    // Create a curved path from bottom-left to top-right
    // Using a bezier-like curve for natural mountain trail
    const t = progress;
    const x = 15 + t * 70; // 15% to 85%
    // More gradual curve - starts steep, flattens near peak
    const curveFactor = Math.sin(t * Math.PI / 2); // Ease-in curve
    const y = 75 - curveFactor * 60; // 75% to 15%
    return { x, y };
  };

  return (
    <div className="mountain-progress-container">
      <div className="mountain-background" style={{ backgroundImage: `url(${mountainImage})` }}>
        {/* Mountain overlay for better visibility */}
        <div className="mountain-overlay"></div>
        
        {/* Steps positioned along the path */}
        <div className="steps-container">
          {steps.map((step, arrayIndex) => {
            // Use step.index if available, otherwise use arrayIndex
            const stepIndex = step.index !== undefined ? step.index : arrayIndex;
            const position = getStepPosition(arrayIndex);
            const isCompleted = completedSteps[String(stepIndex)] || false;
            const isCurrent = stepIndex === currentStepIndex;
            
            // Create handlers with the correct stepIndex captured in closure
            // Use the stepIndex from the closure to ensure we always use the correct value
            const handleClick = (e) => {
              e.stopPropagation();
              const timeoutKey = `step-${stepIndex}`;
              
              // Clear any existing timeout for this step
              if (clickTimeouts.current[timeoutKey]) {
                clearTimeout(clickTimeouts.current[timeoutKey]);
                delete clickTimeouts.current[timeoutKey];
                return;
              }
              
              // Delay single click to allow for double-click detection
              clickTimeouts.current[timeoutKey] = setTimeout(() => {
                onStepClick(stepIndex);
                delete clickTimeouts.current[timeoutKey];
              }, 300);
            };
            
            const handleDoubleClick = (e) => {
              e.preventDefault();
              e.stopPropagation();
              
              const timeoutKey = `step-${stepIndex}`;
              
              // Clear single click timeout
              if (clickTimeouts.current[timeoutKey]) {
                clearTimeout(clickTimeouts.current[timeoutKey]);
                delete clickTimeouts.current[timeoutKey];
              }
              
              // Execute double-click action with the stepIndex from closure
              // This ensures we use the correct index for this specific step element
              onStepComplete(stepIndex);
            };
            
            return (
              <motion.div
                key={`step-${stepIndex}-${arrayIndex}`}
                data-step-index={stepIndex}
                className={`mountain-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${position.y < 40 ? 'tooltip-below' : ''} ${position.x > 70 ? 'tooltip-left' : ''}`}
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: arrayIndex * 0.1 }}
                onClick={handleClick}
                onDoubleClick={handleDoubleClick}
              >
                <div className="step-marker" data-step-index={stepIndex}>
                  <span className="step-number">{stepIndex + 1}</span>
                  {isCompleted && <span className="step-check">✓</span>}
                </div>
                {isCurrent && <div className="step-pulse"></div>}
                {/* Hover tooltip with description */}
                <div className="step-tooltip" data-step-index={stepIndex}>
                  <div className="step-tooltip-title">{step.title || `Step ${stepIndex + 1}`}</div>
                  {step.description && (
                    <div className="step-tooltip-description">{step.description}</div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Path line connecting steps - curved mountain trail */}
        <svg className="mountain-path" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Full path (dashed) - curved trail up the mountain */}
          <path
            d="M 15,75 Q 25,65 35,55 Q 45,45 50,40 Q 55,35 60,30 Q 65,25 70,20 Q 75,18 85,15"
            fill="none"
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth="0.4"
            strokeDasharray="1.5 1.5"
          />
          {/* Completed path (solid, animated) */}
          <motion.path
            d="M 15,75 Q 25,65 35,55 Q 45,45 50,40 Q 55,35 60,30 Q 65,25 70,20 Q 75,18 85,15"
            fill="none"
            stroke="rgba(255, 215, 0, 0.9)"
            strokeWidth="0.6"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progressPercentage / 100 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
        </svg>

        {/* Climber icon */}
        <motion.div
          className="mountain-climber"
          style={{
            left: `${climberX}%`,
            top: `${climberY}%`,
          }}
          initial={{ x: '-50%', y: '-50%', scale: 0 }}
          animate={{ 
            x: '-50%', 
            y: '-50%', 
            scale: 1,
            rotate: progressPercentage === 100 ? [0, 10, -10, 0] : 0
          }}
          transition={{ 
            duration: 0.8,
            rotate: { duration: 0.5, repeat: progressPercentage === 100 ? 2 : 0 }
          }}
        >
          <div className="climber-icon">
            {progressPercentage === 100 ? '🏔️' : '🐐'}
          </div>
          {progressPercentage === 100 && (
            <motion.div
              className="peak-celebration"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              ✨
            </motion.div>
          )}
        </motion.div>

        {/* Friend ghosts */}
        {friendProgress.map((friend, friendIndex) => {
          if (friend.currentStepIndex < 0) return null; // Friend hasn't started
          
          const friendProgressRatio = (friend.currentStepIndex + 1) / totalSteps;
          const friendX = 15 + friendProgressRatio * 70;
          const friendCurveFactor = Math.sin(friendProgressRatio * Math.PI / 2);
          const friendY = 75 - friendCurveFactor * 60;
          
          // Stable offset based on friend index to prevent overlap
          const offsetX = (friendIndex % 3 - 1) * 2.5; // -2.5%, 0%, 2.5%
          const offsetY = Math.floor(friendIndex / 3) * 2.5; // Stagger vertically
          
          // Format last activity time
          const formatTimeAgo = (date) => {
            if (!date) return 'Unknown';
            const now = new Date();
            const then = new Date(date);
            const diffMs = now - then;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);
            
            if (diffMins < 1) return 'Just now';
            if (diffMins < 60) return `${diffMins}m ago`;
            if (diffHours < 24) return `${diffHours}h ago`;
            if (diffDays < 7) return `${diffDays}d ago`;
            return then.toLocaleDateString();
          };

          return (
            <motion.div
              key={friend.userId}
              className="mountain-friend-ghost"
              style={{
                left: `${friendX + offsetX}%`,
                top: `${friendY + offsetY}%`,
              }}
              initial={{ x: '-50%', y: '-50%', scale: 0, opacity: 0 }}
              animate={{ 
                x: '-50%', 
                y: '-50%', 
                scale: 1,
                opacity: 0.8
              }}
              transition={{ 
                duration: 0.8,
                delay: 0.5 + friendIndex * 0.1
              }}
            >
              <div className="friend-ghost-icon">👻</div>
              <div className="friend-ghost-tooltip">
                <div className="friend-ghost-tooltip-name">{friend.username}</div>
                <div className="friend-ghost-tooltip-info">
                  Step {friend.currentStepIndex + 1} of {totalSteps}
                </div>
                {friend.lastActivity && (
                  <div className="friend-ghost-tooltip-time">
                    {formatTimeAgo(friend.lastActivity)}
                  </div>
                )}
                {friend.totalCompleted > 0 && (
                  <div className="friend-ghost-tooltip-progress">
                    {friend.totalCompleted} completed
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Hint for hover interaction */}
        <motion.div
          className="mountain-hint"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <span className="hint-icon">💡</span>
          <span className="hint-text">Hover for details • Double-click to mark complete</span>
        </motion.div>

        {/* Progress percentage display with integrated progress bar */}
        <div className="mountain-progress-text">
          <motion.div
            className="progress-percentage"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            {Math.round(progressPercentage)}%
          </motion.div>
          <div className="progress-label">
            {completedCount} of {totalSteps} steps completed
          </div>
          {/* Integrated progress bar */}
          <div className="mountain-progress-bar-track">
            <motion.div
              className="mountain-progress-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Reset button - bottom left */}
        {onResetProgress && (
          <button
            className="mountain-reset-button"
            onClick={onResetProgress}
            title="Reset all progress"
          >
            ↻
          </button>
        )}
      </div>

    </div>
  );
};

export default MountainProgress;
