import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import './DayNightCycle.css';

// Global animation start time - persists across component remounts
let globalAnimationStartTime = null;

const DayNightCycle = () => {
  const { theme } = useTheme();
  const sunMoonRef = useRef(null);
  const skyOverlayRef = useRef(null);

  useEffect(() => {
    // Initialize global animation start time if not set
    if (!globalAnimationStartTime) {
      globalAnimationStartTime = Date.now();
    }

    // Calculate elapsed time since animation started
    const elapsed = (Date.now() - globalAnimationStartTime) / 1000; // in seconds
    const cycleDuration = 60; // 60 seconds per cycle
    const progress = (elapsed % cycleDuration) / cycleDuration; // 0 to 1

    // Set animation delay to continue from current position
    if (sunMoonRef.current) {
      const delay = -progress * cycleDuration; // Negative delay to start at current position
      sunMoonRef.current.style.animationDelay = `${delay}s`;
    }

    if (skyOverlayRef.current) {
      const delay = -progress * cycleDuration;
      skyOverlayRef.current.style.animationDelay = `${delay}s`;
    }
  }, []);

  return (
    <div className={`day-night-cycle theme-${theme}`}>
      {/* Sun/Moon that moves across the sky */}
      <div className="sun-moon" ref={sunMoonRef} />
      
      {/* Gradient overlay that changes with time of day */}
      <div className="sky-overlay" ref={skyOverlayRef} />
      
      {/* Stars for night time */}
      <div className="stars-container">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${(i * 7.3) % 100}%`,
              top: `${(i * 11.7) % 60}%`,
              animationDelay: `${(i * 0.3) % 3}s`,
              animationDuration: `${2 + (i % 3)}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(DayNightCycle);