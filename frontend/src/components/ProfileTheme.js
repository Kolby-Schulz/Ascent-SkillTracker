import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import './ProfileTheme.css';

const THEMES = [
  {
    id: 'default',
    name: 'Default',
    gradient: 'linear-gradient(135deg, #a855f7 0%, #4f7cff 100%)',
    description: 'Purple to blue gradient',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FFA500 100%)',
    description: 'Warm sunset colors',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    gradient: 'linear-gradient(135deg, #4ECDC4 0%, #44A3D8 100%)',
    description: 'Cool ocean blues',
  },
  {
    id: 'forest',
    name: 'Forest',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    description: 'Natural green tones',
  },
  {
    id: 'gold',
    name: 'Gold',
    gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    description: 'Luxurious gold',
  },
  {
    id: 'midnight',
    name: 'Midnight',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    description: 'Deep dark theme',
  },
];

const ProfileTheme = () => {
  const { t } = useTranslation(['profile', 'common']);
  const { user } = useAuth();
  const [selectedTheme, setSelectedTheme] = useState('default');

  const userId = user?.id || user?._id || 'default';

  useEffect(() => {
    // Load saved theme preference
    const savedTheme = localStorage.getItem(`profileTheme_${userId}`);
    if (savedTheme) {
      setSelectedTheme(savedTheme);
    }
    // Apply theme on mount
    applyTheme(savedTheme || 'default');
  }, [userId]);

  // Re-apply theme when selectedTheme changes
  useEffect(() => {
    applyTheme(selectedTheme);
  }, [selectedTheme]);

  const applyTheme = (themeId) => {
    const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
    // Set CSS variable - avatars will use this via CSS
    document.documentElement.style.setProperty('--profile-theme-gradient', theme.gradient);
  };

  const handleThemeChange = (themeId) => {
    setSelectedTheme(themeId);
    localStorage.setItem(`profileTheme_${userId}`, themeId);
    applyTheme(themeId);
  };

  return (
    <div className="profile-theme-section glass-panel">
      <h2 className="theme-section-title">{t('profile:theme.title')}</h2>
      <p className="theme-section-description">{t('profile:theme.description')}</p>
      
      <div className="themes-grid">
        {THEMES.map((theme) => (
          <motion.button
            key={theme.id}
            className={`theme-option ${selectedTheme === theme.id ? 'active' : ''}`}
            onClick={() => handleThemeChange(theme.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div
              className="theme-preview"
              style={{ background: theme.gradient }}
            />
            <div className="theme-info">
              <h4 className="theme-name">{theme.name}</h4>
              <p className="theme-desc">{theme.description}</p>
            </div>
            {selectedTheme === theme.id && (
              <motion.div
                className="theme-check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                ✓
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ProfileTheme;
