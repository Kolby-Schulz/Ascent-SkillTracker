import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './Settings.css';

const Settings = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('account');
  
  // Edit mode states
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [isEditingSecurity, setIsEditingSecurity] = useState(false);
  
  // Form states
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    // Update form fields when user changes
    setUsername(user?.username || '');
    setEmail(user?.email || '');
  }, [user]);

  const handleEditAccount = () => {
    setIsEditingAccount(true);
  };

  const handleSaveAccount = (e) => {
    e.preventDefault();
    // TODO: Implement account update API call
    console.log('Saving account settings:', { username, email });
    setIsEditingAccount(false);
  };

  const handleCancelAccount = () => {
    // Reset to original values
    setUsername(user?.username || '');
    setEmail(user?.email || '');
    setIsEditingAccount(false);
  };

  const handleEditSecurity = () => {
    setIsEditingSecurity(true);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    // TODO: Implement password change API call
    console.log('Changing password');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsEditingSecurity(false);
  };

  const handleCancelSecurity = () => {
    // Clear password fields
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsEditingSecurity(false);
  };


  const tabs = [
    { id: 'account', label: 'Account' },
    { id: 'security', label: 'Security' },
    { id: 'preferences', label: 'Preferences' },
  ];

  return (
    <motion.div
      className="settings-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="settings-header">
        <h1 className="settings-title">Settings</h1>
        <p className="settings-subtitle">Manage your account settings and preferences</p>
      </div>

      <div className="settings-content">
        {/* Tabs */}
        <div className="settings-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="settings-tab-content">
          {/* Account Tab */}
          {activeTab === 'account' && (
            <motion.div
              className="settings-section glass-panel"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="section-title">Account Information</h2>
              <form onSubmit={handleSaveAccount} className="settings-form">
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    disabled={!isEditingAccount}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    disabled={!isEditingAccount}
                  />
                </div>
                <div className="form-actions">
                  {!isEditingAccount ? (
                    <button type="button" onClick={handleEditAccount} className="settings-button-edit">
                      Edit
                    </button>
                  ) : (
                    <>
                      <button type="button" onClick={handleCancelAccount} className="settings-button-cancel">
                        Cancel
                      </button>
                      <button type="submit" className="settings-button settings-button-purple">
                        Save Changes
                      </button>
                    </>
                  )}
                </div>
              </form>
            </motion.div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <motion.div
              className="settings-section glass-panel"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="section-title">Change Password</h2>
              <form onSubmit={handleChangePassword} className="settings-form">
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    disabled={!isEditingSecurity}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    disabled={!isEditingSecurity}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    disabled={!isEditingSecurity}
                  />
                </div>
                <div className="form-actions">
                  {!isEditingSecurity ? (
                    <button type="button" onClick={handleEditSecurity} className="settings-button-edit">
                      Edit
                    </button>
                  ) : (
                    <>
                      <button type="button" onClick={handleCancelSecurity} className="settings-button-cancel">
                        Cancel
                      </button>
                      <button type="submit" className="settings-button settings-button-purple">
                        Update Password
                      </button>
                    </>
                  )}
                </div>
              </form>
            </motion.div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <motion.div
              className="settings-section glass-panel"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="section-title">App Preferences</h2>
              <div className="settings-form">
                <div className="form-group">
                  <label htmlFor="theme">Theme</label>
                  <select
                    id="theme"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="settings-select"
                  >
                    <option value="auto">Auto (Sun moves across screen)</option>
                    <option value="light">Light (Always day time)</option>
                    <option value="dark">Dark (Always night time with stars)</option>
                  </select>
                  <p className="field-description">
                    {theme === 'auto' && 'The sun will move across the screen in a day/night cycle'}
                    {theme === 'light' && 'The dashboard will stay in day time mode'}
                    {theme === 'dark' && 'The dashboard will stay in night time mode with twinkling stars'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
