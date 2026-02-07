import React, { useState, useEffect } from 'react';
import './FlyingBirds.css';

const FlyingBirds = () => {
  const [birdKey, setBirdKey] = useState(0);

  useEffect(() => {
    // Show birds immediately on mount
    setBirdKey(1);

    // Then show them every 20 seconds (for testing - change back to 30000 for production)
    // Using 20 seconds to ensure birds complete their 15-18 second animation
    const interval = setInterval(() => {
      setBirdKey(prev => prev + 1);
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flying-birds-container">
      {[...Array(5)].map((_, index) => (
        <div
          key={`${birdKey}-${index}`}
          className="bird"
          style={{
            '--delay': `${index * 0.15}s`,
            '--duration': `${15 + Math.random() * 3}s`,
            '--start-y': `${20 + Math.random() * 30}%`,
          }}
        >
          <svg
            viewBox="0 0 60 30"
            fill="black"
            className="bird-silhouette"
          >
            {/* Bird silhouette in flight - V shape flipped */}
            <path d="M5 15 L30 25 L55 15 L30 20 Z" />
          </svg>
        </div>
      ))}
    </div>
  );
};

export default FlyingBirds;
