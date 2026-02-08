import React, { useRef } from 'react';
import './DriftingClouds.css';

const DriftingClouds = () => {
  // Store random values in a ref so they don't change on re-renders
  // Create more clouds with better distribution and varied speeds
  const cloudStylesRef = useRef(
    [...Array(6)].map((_, index) => {
      // Varied horizontal starting positions:
      // - Some start off-screen left (will drift in)
      // - Some start on-screen (already visible)
      // - Some start on the right side (already there)
      const positionType = Math.random();
      let startX;
      if (positionType < 0.4) {
        // 40% start off-screen left
        startX = -30 + Math.random() * 20; // -30% to -10%
      } else if (positionType < 0.8) {
        // 40% start on-screen (visible immediately)
        startX = -10 + Math.random() * 50; // -10% to 40%
      } else {
        // 20% start on the right side (already there)
        startX = 40 + Math.random() * 30; // 40% to 70%
      }
      
      // More varied vertical positions (spread across entire viewport height)
      const startY = 5 + Math.random() * 70; // 5% to 75%
      
      // More varied speeds - some fast, some slow
      const baseDuration = 40 + Math.random() * 80; // 40s to 120s
      const duration = baseDuration;
      
      // Minimal delays - clouds start moving immediately
      const delay = Math.random() * 2; // Small random delay (0-2s) to prevent exact synchronization
      
      // Varied sizes
      const size = 120 + Math.random() * 130; // 120px to 250px
      
      return {
        '--delay': `${delay}s`,
        '--duration': `${duration}s`,
        '--start-x': `${startX}%`,
        '--start-y': `${startY}%`,
        '--size': `${size}px`,
      };
    })
  );

  return (
    <div className="clouds-container">
      {cloudStylesRef.current.map((style, index) => (
        <div
          key={index}
          className="cloud"
          style={style}
        >
          <svg viewBox="0 0 200 100" fill="rgba(255, 255, 255, 0.5)" className="cloud-shape">
            {/* Fluffy cloud shape with multiple overlapping circles */}
            <circle cx="30" cy="50" r="25" />
            <circle cx="50" cy="45" r="30" />
            <circle cx="70" cy="50" r="28" />
            <circle cx="90" cy="48" r="26" />
            <circle cx="110" cy="52" r="24" />
            <circle cx="130" cy="50" r="27" />
            <circle cx="150" cy="48" r="25" />
            <circle cx="170" cy="50" r="23" />
            {/* Bottom puffs */}
            <circle cx="40" cy="65" r="20" />
            <circle cx="60" cy="68" r="22" />
            <circle cx="80" cy="66" r="21" />
            <circle cx="100" cy="70" r="20" />
            <circle cx="120" cy="68" r="19" />
            <circle cx="140" cy="66" r="21" />
            {/* Top puffs */}
            <circle cx="45" cy="35" r="18" />
            <circle cx="65" cy="32" r="20" />
            <circle cx="85" cy="35" r="19" />
            <circle cx="105" cy="33" r="17" />
            <circle cx="125" cy="35" r="19" />
            <circle cx="145" cy="32" r="18" />
          </svg>
        </div>
      ))}
    </div>
  );
};

export default DriftingClouds;
