import React, { useState, useEffect } from 'react';
import './WindEffect.css';

const WindEffect = () => {
  const [windActive, setWindActive] = useState(false);

  useEffect(() => {
    // Initial wind after 3 seconds
    const initialTimeout = setTimeout(() => {
      setWindActive(true);
      document.body.classList.add('wind-active');
      setTimeout(() => {
        setWindActive(false);
        document.body.classList.remove('wind-active');
      }, 3000);
    }, 3000);

    // Then wind every 20-30 seconds
    const interval = setInterval(() => {
      setWindActive(true);
      document.body.classList.add('wind-active');
      setTimeout(() => {
        setWindActive(false);
        document.body.classList.remove('wind-active');
      }, 3000);
    }, 20000 + Math.random() * 10000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
      document.body.classList.remove('wind-active');
    };
  }, []);

  return (
    <div className={`wind-effect ${windActive ? 'active' : ''}`}>
      <div className="wind-layer wind-layer-1"></div>
      <div className="wind-layer wind-layer-2"></div>
      <div className="wind-layer wind-layer-3"></div>
    </div>
  );
};

export default WindEffect;
