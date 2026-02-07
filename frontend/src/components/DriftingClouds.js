import React from 'react';
import './DriftingClouds.css';

const DriftingClouds = () => {
  return (
    <div className="clouds-container">
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className="cloud"
          style={{
            '--delay': `${index * 3}s`,
            '--duration': `${60 + Math.random() * 40}s`,
            '--start-x': `${-20 + Math.random() * 20}%`,
            '--start-y': `${10 + Math.random() * 20}%`,
            '--size': `${150 + Math.random() * 100}px`,
          }}
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
