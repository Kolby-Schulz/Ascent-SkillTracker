import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { updateProfile } from '../services/authService';
import ConfirmationModal from '../components/ConfirmationModal';
import Notification from '../components/Notification';
import './Settings.css';

const Settings = () => {
  const { user, setUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('account');
  const [privacy, setPrivacy] = useState(() => {
    // Initialize from user object, fallback to 'public'
    return user?.privacy || 'public';
  });
  
  // Edit mode states
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [isEditingSecurity, setIsEditingSecurity] = useState(false);
  
  // Modal and notification states
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [pendingPrivacy, setPendingPrivacy] = useState(null);
  const [notification, setNotification] = useState({ isVisible: false, message: '', type: 'success' });
  
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
    if (user?.privacy) {
      setPrivacy(user.privacy);
    }
  }, [user]);

  // Add/remove blur class on body when modal is open
  useEffect(() => {
    if (showConfirmationModal) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [showConfirmationModal]);

  const handlePrivacyChange = (newPrivacy) => {
    // If switching to private, show confirmation modal
    if (newPrivacy === 'private' && privacy === 'public') {
      setPendingPrivacy(newPrivacy);
      setShowConfirmationModal(true);
    } else {
      // If switching to public or already private, update directly
      updatePrivacySetting(newPrivacy);
    }
  };

  const updatePrivacySetting = async (newPrivacy) => {
    try {
      setPrivacy(newPrivacy);
      const response = await updateProfile({ privacy: newPrivacy });
      if (response.success && response.data.user) {
        const updatedUser = response.data.user;
        setUser(updatedUser);
        // Update localStorage to persist the change
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          userData.privacy = updatedUser.privacy;
          localStorage.setItem('user', JSON.stringify(userData));
        }
        setNotification({
          isVisible: true,
          message: 'Privacy settings updated successfully!',
          type: 'success',
        });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error updating privacy:', error);
      // Revert on error
      setPrivacy(user?.privacy || 'public');
      const errorMessage = error.response?.data?.error || error.message || 'Failed to update privacy setting. Please try again.';
      setNotification({
        isVisible: true,
        message: errorMessage,
        type: 'error',
      });
    }
  };

  const handleConfirmPrivacyChange = () => {
    if (pendingPrivacy) {
      updatePrivacySetting(pendingPrivacy);
      setPendingPrivacy(null);
    }
    setShowConfirmationModal(false);
  };

  const handleCancelPrivacyChange = () => {
    setPendingPrivacy(null);
    setShowConfirmationModal(false);
  };

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
                <div className="form-group">
                  <label htmlFor="privacy">Privacy Setting</label>
                  <div className="privacy-toggle">
                    <button
                      type="button"
                      className={`privacy-option ${privacy === 'public' ? 'active' : ''}`}
                      onClick={() => handlePrivacyChange('public')}
                    >
                      Public
                    </button>
                    <button
                      type="button"
                      className={`privacy-option ${privacy === 'private' ? 'active' : ''}`}
                      onClick={() => handlePrivacyChange('private')}
                    >
                      Private
                    </button>
                  </div>
                  <p className="field-description">
                    {privacy === 'public'
                      ? 'Your profile and accomplished skills are visible to everyone'
                      : 'Your profile and skills are only visible to your friends'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={handleCancelPrivacyChange}
        onConfirm={handleConfirmPrivacyChange}
        title="Switch to Private Mode?"
        message="By switching to private mode, you will no longer appear in the public feed and other users will need to search for you to find your profile. Only your friends will be able to see your profile and accomplished skills. Are you sure you want to continue?"
        confirmText="Yes, Make Private"
        cancelText="Cancel"
      />

      {/* Notification */}
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() => setNotification({ ...notification, isVisible: false })}
      />
    </motion.div>
  );
};

export default Settings;
