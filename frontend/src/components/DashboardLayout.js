import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import MetricsTab from './MetricsTab';
import DayNightCycle from './DayNightCycle';
import FloatingParticles from './FloatingParticles';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const { t } = useTranslation(['navigation', 'common']);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef(null);

  const userDisplayName = user?.username || user?.email?.split('@')[0] || 'User';
  const backgroundImage = process.env.PUBLIC_URL + '/images/6229893.jpg';

  const SIDEBAR_ITEMS = [
    { id: 'dashboard', label: t('navigation:dashboard'), path: '/dashboard' },
    { id: 'create', label: t('navigation:create'), path: '/dashboard/create', icon: '➕' },
    { id: 'learn-skill', label: t('navigation:learnSkill'), path: '/dashboard/learn-skill' },
    { id: 'feed', label: t('navigation:feed'), path: '/dashboard/feed' },
    { id: 'friends', label: t('navigation:friends'), path: '/dashboard/friends' },
    { id: 'leaderboard', label: t('navigation:leaderboard'), path: '/dashboard/leaderboard' },
    { id: 'settings', label: t('navigation:settings'), path: '/dashboard/settings' },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getActiveNav = () => {
    const currentPath = location.pathname;
    const activeItem = SIDEBAR_ITEMS.find(item => currentPath === item.path);
    return activeItem ? activeItem.id : 'dashboard';
  };

  const handleNavClick = (path) => {
    navigate(path);
  };

  const isCreatePage = location.pathname.includes('/create');
  const isLeaderboardPage = location.pathname === '/dashboard/leaderboard';

  return (
    <div className={`dashboard-layout ${isCreatePage ? 'layout-create' : ''} ${isLeaderboardPage ? 'layout-leaderboard' : ''}`} style={{ backgroundImage: `url(${backgroundImage})` }}>
      <DayNightCycle />
      <FloatingParticles />
      {/* Left Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand-row">
          <motion.div
            className="brand-logo"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="brand-title">Ascent</h1>
            <p className="brand-tagline">Reach New Heights</p>
          </motion.div>
        </div>
        <nav className="sidebar-nav">
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`sidebar-nav-item ${getActiveNav() === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item.path)}
            >
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <Outlet />
      </main>

      {/* Right Sidebar - floats on Create and Leaderboard pages, normal on others */}
      <aside className={`dashboard-right-sidebar ${isCreatePage || isLeaderboardPage ? 'profile-float' : ''}`}>
        <div className="profile-area" ref={profileRef}>
          <div className="profile-wrapper">
            <button
              className="profile-avatar"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              aria-label="Open settings"
            >
              <div className="avatar-placeholder">
                {userDisplayName.charAt(0).toUpperCase()}
              </div>
            </button>
            {profileMenuOpen && (
              <div className="profile-dropdown glass-panel">
                <button className="dropdown-item" onClick={() => navigate('/dashboard/profile')}>
                  {t('navigation:profile')}
                </button>
                <button className="dropdown-item" onClick={() => navigate('/dashboard/settings')}>
                  {t('navigation:settings')}
                </button>
                <button className="dropdown-item" onClick={logout}>
                  {t('common:buttons.logout')}
                </button>
              </div>
            )}
          </div>
        </div>
        {!isCreatePage && !isLeaderboardPage && <MetricsTab />}
      </aside>
    </div>
  );
};

export default DashboardLayout;
