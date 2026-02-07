import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import FlyingBirds from '../components/FlyingBirds';
import DriftingClouds from '../components/DriftingClouds';
import WindEffect from '../components/WindEffect';
import './Home.css';

const Home = () => {
  const backgroundImage = process.env.PUBLIC_URL + '/images/6229869.jpg';

  return (
    <>
      <DriftingClouds />
      <WindEffect />
      <FlyingBirds />
      <motion.div
        className="home-container"
        style={{ backgroundImage: `url(${backgroundImage})` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
      <div className="hero-section">
        <motion.h1
          className="hero-title"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Ascent
        </motion.h1>
        <motion.p
          className="hero-subtitle"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Reach New Heights
        </motion.p>

        <motion.div
          className="cta-buttons"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link to="/register">
            <motion.button
              className="cta-button primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </Link>
          <Link to="/login">
            <motion.button
              className="cta-button secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign In
            </motion.button>
          </Link>
        </motion.div>
      </div>

      <motion.div
        className="features-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="feature-card">
          <h3>📚 Structured Learning</h3>
          <p>
            Follow step-by-step roadmaps designed to help you master any skill
          </p>
        </div>
        <div className="feature-card">
          <h3>🎯 Track Progress</h3>
          <p>Monitor your journey and celebrate milestones along the way</p>
        </div>
        <div className="feature-card">
          <h3>🚀 Stay Motivated</h3>
          <p>Visual roadmaps keep you engaged and focused on your goals</p>
        </div>
      </motion.div>
    </motion.div>
    </>
  );
};

export default Home;
