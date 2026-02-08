import React from 'react';
import './DayNightCycle.css';

const DayNightCycle = () => {
  return (
    <div className="day-night-cycle">
      {/* Sun/Moon that moves across the sky */}
      <div className="sun-moon" />
      
      {/* Gradient overlay that changes with time of day */}
      <div className="sky-overlay" />
      
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

export default DayNightCycle;