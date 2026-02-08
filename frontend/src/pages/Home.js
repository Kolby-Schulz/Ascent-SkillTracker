import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import FlyingBirds from '../components/FlyingBirds';
import DriftingClouds from '../components/DriftingClouds';
import WindEffect from '../components/WindEffect';
import './Home.css';

const Home = () => {
  const { t } = useTranslation(['home', 'common']);
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
        <motion.div
          className="brand-logo hero-brand"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="brand-title">Ascent</h1>
          <p className="brand-tagline">Reach New Heights</p>
        </motion.div>

        <motion.div
          className="cta-buttons"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link to="/register">
            <motion.button
              className="cta-button primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('home:getStarted')}
            </motion.button>
          </Link>
          <Link to="/login">
            <motion.button
              className="cta-button secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('home:signIn')}
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
    </>
  );
};

export default Home;
