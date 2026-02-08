import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './DashboardLayout.css';

const SIDEBAR_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
  { id: 'create', label: 'Create', path: '/dashboard/create', icon: '➕' },
  { id: 'learn-skill', label: 'Learn Skill', path: '/dashboard/learn-skill' },
  { id: 'saved', label: 'Saved', path: '/dashboard/saved' },
  { id: 'feed', label: 'Feed', path: '/dashboard/feed' },
  { id: 'settings', label: 'Settings', path: '/dashboard/settings' },
];

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef(null);

  const userDisplayName = user?.username || user?.email?.split('@')[0] || 'User';

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

  return (
    <div className={`dashboard-layout ${isCreatePage ? 'layout-create' : ''}`}>
      {/* Left Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <div className="logo-shapes">
            <span className="logo-square" />
            <span className="logo-circle" />
            <span className="logo-triangle" />
          </div>
        </div>
        <nav className="sidebar-nav">
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`sidebar-nav-item ${getActiveNav() === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item.path)}
            >
              <span className="nav-icon">{item.icon || item.label.charAt(0)}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <Outlet />
      </main>

      {/* Right Sidebar - floats on Create page, normal on others */}
      <aside className={`dashboard-right-sidebar ${isCreatePage ? 'profile-float' : ''}`}>
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
                  Profile
                </button>
                <button className="dropdown-item" onClick={() => navigate('/dashboard/settings')}>
                  Settings
                </button>
                <button className="dropdown-item" onClick={logout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default DashboardLayout;
