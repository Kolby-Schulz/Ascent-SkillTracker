import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { login as loginService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import FlyingBirds from '../components/FlyingBirds';
import DriftingClouds from '../components/DriftingClouds';
import WindEffect from '../components/WindEffect';
import './Auth.css';

const Login = () => {
  const { t } = useTranslation(['auth', 'common']);
  const navigate = useNavigate();
  const { login, loginAsDemoUser } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { username, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await loginService({ username: username.trim().toLowerCase(), password });
      
      // Handle response structure - check if it's response.data or just response
      const token = response.data?.token || response.token;
      const user = response.data?.user || response.user;
      
      if (!token || !user) {
        throw new Error('Invalid response from server');
      }
      
      // Save to localStorage and update auth context
      login(token, user);
      
      // Try React Router navigation first, fallback to window.location for Cursor compatibility
      try {
        navigate('/dashboard');
        // Fallback: if navigate doesn't work, use window.location after a short delay
        setTimeout(() => {
          if (window.location.pathname !== '/dashboard') {
            window.location.href = '/dashboard';
          }
        }, 100);
      } catch (navError) {
        // If navigate fails, use window.location directly
        console.warn('React Router navigate failed, using window.location:', navError);
        window.location.href = '/dashboard';
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.error || err.message || 'Login failed. Please try again.'
      );
      setLoading(false);
    }
  };

  const backgroundImage = process.env.PUBLIC_URL + '/images/6229869.jpg';

  return (
    <>
      <DriftingClouds />
      <WindEffect />
      <FlyingBirds />
      <motion.div
        className="auth-container"
        style={{ backgroundImage: `url(${backgroundImage})` }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="auth-card">
        <h1 className="auth-title">{t('auth:login.title')}</h1>
        <p className="auth-subtitle">{t('auth:login.subtitle')}</p>

        {error && (
          <motion.div
            className="error-message"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">{t('auth:login.username')}</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={handleChange}
              placeholder={t('auth:login.usernamePlaceholder')}
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{t('auth:login.password')}</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder={t('auth:login.passwordPlaceholder')}
              required
              autoComplete="current-password"
              minLength="6"
            />
          </div>

          <motion.button
            type="submit"
            className="auth-button"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? t('auth:login.signingIn') : t('auth:login.signIn')}
          </motion.button>

          <motion.button
            type="button"
            className="auth-button auth-button-demo"
            onClick={() => {
              loginAsDemoUser();
              navigate('/dashboard');
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            DEMO BUTTON REMOVE BEFORE DEVPOST
          </motion.button>
        </form>

        <p className="auth-footer">
          {t('auth:login.noAccount')}{' '}
          <Link to="/register" className="auth-link">
            {t('auth:login.signUp')}
          </Link>
        </p>
      </div>
    </motion.div>
    </>
  );
};

export default Login;
