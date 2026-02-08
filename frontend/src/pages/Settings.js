import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { updateProfile } from '../services/authService';
import ConfirmationModal from '../components/ConfirmationModal';
import Notification from '../components/Notification';
import './Settings.css';

const Settings = () => {
  const { t, i18n } = useTranslation(['settings', 'common']);
  const { user, setUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState(i18n.language);
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
    // Sync language with i18n
    setLanguage(i18n.language);
  }, [user, i18n.language]);

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
          message: t('settings:notifications.privacyUpdated'),
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


  const handleLanguageChange = (newLanguage) => {
    i18n.changeLanguage(newLanguage);
    setLanguage(newLanguage);
  };

  const tabs = [
    { id: 'account', label: t('settings:tabs.account') },
    { id: 'security', label: t('settings:tabs.security') },
    { id: 'preferences', label: t('settings:tabs.preferences') },
  ];

  return (
    <motion.div
      className="settings-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="settings-header">
        <h1 className="settings-title">{t('settings:title')}</h1>
        <p className="settings-subtitle">{t('settings:subtitle')}</p>
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
              <h2 className="section-title">{t('settings:account.title')}</h2>
              <form onSubmit={handleSaveAccount} className="settings-form">
                <div className="form-group">
                  <label htmlFor="username">{t('settings:account.username')}</label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={t('settings:account.usernamePlaceholder')}
                    disabled={!isEditingAccount}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">{t('settings:account.email')}</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('settings:account.emailPlaceholder')}
                    disabled={!isEditingAccount}
                  />
                </div>
                <div className="form-actions">
                  {!isEditingAccount ? (
                    <button type="button" onClick={handleEditAccount} className="settings-button-edit settings-button-purple">
                      {t('common:buttons.edit')}
                    </button>
                  ) : (
                    <>
                      <button type="button" onClick={handleCancelAccount} className="settings-button-cancel">
                        {t('common:buttons.cancel')}
                      </button>
                      <button type="submit" className="settings-button settings-button-purple">
                        {t('settings:account.saveChanges')}
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
              <h2 className="section-title">{t('settings:security.title')}</h2>
              <form onSubmit={handleChangePassword} className="settings-form">
                <div className="form-group">
                  <label htmlFor="currentPassword">{t('settings:security.currentPassword')}</label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder={t('settings:security.currentPasswordPlaceholder')}
                    disabled={!isEditingSecurity}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="newPassword">{t('settings:security.newPassword')}</label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={t('settings:security.newPasswordPlaceholder')}
                    disabled={!isEditingSecurity}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">{t('settings:security.confirmPassword')}</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t('settings:security.confirmPasswordPlaceholder')}
                    disabled={!isEditingSecurity}
                  />
                </div>
                <div className="form-actions">
                  {!isEditingSecurity ? (
                    <button type="button" onClick={handleEditSecurity} className="settings-button-edit settings-button-purple">
                      {t('common:buttons.edit')}
                    </button>
                  ) : (
                    <>
                      <button type="button" onClick={handleCancelSecurity} className="settings-button-cancel">
                        {t('common:buttons.cancel')}
                      </button>
                      <button type="submit" className="settings-button settings-button-purple">
                        {t('settings:security.updatePassword')}
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
              <h2 className="section-title">{t('settings:preferences.title')}</h2>
              <div className="settings-form">
                <div className="form-group">
                  <label htmlFor="language">{t('settings:preferences.language')}</label>
                  <select
                    id="language"
                    value={language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="settings-select"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                  <p className="field-description">
                    {t('settings:preferences.languageDescription')}
                  </p>
                </div>
                <div className="form-group">
                  <label htmlFor="theme">{t('settings:preferences.theme')}</label>
                  <select
                    id="theme"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="settings-select"
                  >
                    <option value="auto">{t('settings:preferences.themeOptions.auto')}</option>
                    <option value="light">{t('settings:preferences.themeOptions.light')}</option>
                    <option value="dark">{t('settings:preferences.themeOptions.dark')}</option>
                  </select>
                  <p className="field-description">
                    {theme === 'auto' && t('settings:preferences.themeDescriptions.auto')}
                    {theme === 'light' && t('settings:preferences.themeDescriptions.light')}
                    {theme === 'dark' && t('settings:preferences.themeDescriptions.dark')}
                  </p>
                </div>
                <div className="form-group">
                  <label htmlFor="privacy">{t('settings:preferences.privacy')}</label>
                  <div className="privacy-toggle">
                    <button
                      type="button"
                      className={`privacy-option ${privacy === 'public' ? 'active' : ''}`}
                      onClick={() => handlePrivacyChange('public')}
                    >
                      {t('settings:preferences.privacyOptions.public')}
                    </button>
                    <button
                      type="button"
                      className={`privacy-option ${privacy === 'private' ? 'active' : ''}`}
                      onClick={() => handlePrivacyChange('private')}
                    >
                      {t('settings:preferences.privacyOptions.private')}
                    </button>
                  </div>
                  <p className="field-description">
                    {privacy === 'public'
                      ? t('settings:preferences.privacyDescriptions.public')
                      : t('settings:preferences.privacyDescriptions.private')}
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
        title={t('settings:modal.privacyTitle')}
        message={t('settings:modal.privacyMessage')}
        confirmText={t('settings:modal.confirmPrivate')}
        cancelText={t('common:buttons.cancel')}
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
