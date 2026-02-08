import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import friendService from '../services/friendService';
import './Friends.css';

const Friends = () => {
  const { t } = useTranslation(['friends', 'common']);
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('friends'); // friends, requests, search
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'friends') {
      loadFriends();
    } else if (activeTab === 'requests') {
      loadFriendRequests();
    }
  }, [activeTab]);

  const loadFriends = async () => {
    setLoading(true);
    try {
      const response = await friendService.getFriends();
      setFriends(response.data?.data?.friends || response.data?.friends || []);
    } catch (error) {
      console.error('Error loading friends:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFriendRequests = async () => {
    setLoading(true);
    try {
      const response = await friendService.getFriendRequests();
      setRequests(response.data?.data?.requests || response.data?.requests || []);
    } catch (error) {
      console.error('Error loading friend requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.length < 2) {
      alert(t('friends:messages.searchError'));
      return;
    }

    setLoading(true);
    try {
      const response = await friendService.searchUsers(searchQuery);
      console.log('Search results:', response.data); // Debug log
      const users = response.data?.data?.users || response.data?.users || [];
      setSearchResults(users);
      if (users.length === 0) {
        // No results found - this is normal, not an error
        console.log('No users found matching:', searchQuery);
      }
    } catch (error) {
      console.error('Error searching users:', error);
      const errorMessage = error.response?.data?.error || error.message || t('friends:messages.searchError');
      alert(errorMessage);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (userId) => {
    try {
      await friendService.sendFriendRequest(userId);
      // Update search results
      const updatedResults = searchResults.map((u) =>
        u.id === userId ? { ...u, relationshipStatus: 'pending' } : u
      );
      setSearchResults(updatedResults);
      alert(t('friends:messages.requestSent'));
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert(error.response?.data?.error || t('friends:messages.requestSent'));
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await friendService.acceptFriendRequest(requestId);
      setRequests(requests.filter((req) => req.id !== requestId));
      loadFriends(); // Refresh friends list
      alert(t('friends:messages.requestAccepted'));
    } catch (error) {
      console.error('Error accepting request:', error);
      alert(t('friends:messages.requestAccepted'));
    }
  };

  const handleRemoveFriend = async (friendshipId) => {
    if (!window.confirm(t('friends:messages.removeConfirm'))) return;

    try {
      await friendService.removeFriend(friendshipId);
      setFriends(friends.filter((f) => f.friendshipId !== friendshipId));
      alert(t('friends:messages.friendRemoved'));
    } catch (error) {
      console.error('Error removing friend:', error);
      alert(t('friends:messages.friendRemoved'));
    }
  };

  return (
    <motion.div
      className="friends-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="friends-header">
        <h1 className="friends-title">{t('friends:title')}</h1>
        <p className="friends-subtitle">{t('friends:subtitle')}</p>
      </div>

      <div className="friends-tabs">
        <button
          className={`friends-tab ${activeTab === 'friends' ? 'active' : ''}`}
          onClick={() => setActiveTab('friends')}
        >
          {t('friends:tabs.friends')} ({friends.length})
        </button>
        <button
          className={`friends-tab ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          {t('friends:tabs.requests')} ({requests.length})
        </button>
        <button
          className={`friends-tab ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          {t('friends:tabs.search')}
        </button>
      </div>

      <div className="friends-content">
        {loading && (
            <div className="loading-state">
            <div className="spinner"></div>
            <p>{t('common:messages.loading')}</p>
          </div>
        )}

        {!loading && activeTab === 'friends' && (
          <div className="friends-list">
            {friends.length === 0 ? (
              <div className="empty-state">
                <p>{t('friends:friends.noFriends')}</p>
              </div>
            ) : (
              friends.map((friend) => (
                <motion.div
                  key={friend.id}
                  className="friend-card glass-panel"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="friend-avatar">
                    {friend.profilePicture ? (
                      <img src={friend.profilePicture} alt={friend.username} />
                    ) : (
                      <div className="avatar-placeholder">
                        {friend.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="friend-info">
                    <h3 className="friend-username">{friend.username}</h3>
                    <p className="friend-email">{friend.email}</p>
                  </div>
                  <button
                    className="remove-friend-button"
                    onClick={() => handleRemoveFriend(friend.friendshipId)}
                    title={t('friends:friends.remove')}
                  >
                    {t('friends:friends.remove')}
                  </button>
                </motion.div>
              ))
            )}
          </div>
        )}

        {!loading && activeTab === 'requests' && (
          <div className="requests-list">
            {requests.length === 0 ? (
              <div className="empty-state">
                <p>{t('friends:requests.noRequests')}</p>
              </div>
            ) : (
              requests.map((request) => (
                <motion.div
                  key={request.id}
                  className="request-card glass-panel"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="friend-avatar">
                    {request.requester.profilePicture ? (
                      <img src={request.requester.profilePicture} alt={request.requester.username} />
                    ) : (
                      <div className="avatar-placeholder">
                        {request.requester.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="friend-info">
                    <h3 className="friend-username">{request.requester.username}</h3>
                    <p className="friend-email">{request.requester.email}</p>
                  </div>
                  <div className="request-actions">
                    <button
                      className="accept-button"
                      onClick={() => handleAcceptRequest(request.id)}
                    >
                      {t('friends:requests.accept')}
                    </button>
                    <button
                      className="reject-button"
                      onClick={() => handleRemoveFriend(request.id)}
                    >
                      {t('friends:requests.reject')}
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {!loading && activeTab === 'search' && (
          <div className="search-section">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('friends:search.placeholder')}
                className="search-input"
              />
              <button type="submit" className="search-button">
                {t('friends:search.search')}
              </button>
            </form>

            {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map((user) => (
                  <motion.div
                    key={user.id}
                    className="user-card glass-panel"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="friend-avatar">
                      {user.profilePicture ? (
                        <img src={user.profilePicture} alt={user.username} />
                      ) : (
                        <div className="avatar-placeholder">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="friend-info">
                      <h3 className="friend-username">{user.username}</h3>
                      <p className="friend-email">{user.email}</p>
                      {user.privacy === 'private' && (
                        <span className="privacy-badge">{t('friends:search.private')}</span>
                      )}
                    </div>
                    <div className="user-actions">
                      {user.relationshipStatus === null && (
                        <button
                          className="add-friend-button"
                          onClick={() => handleSendRequest(user.id)}
                        >
                          {t('friends:search.addFriend')}
                        </button>
                      )}
                      {user.relationshipStatus === 'pending' && (
                        <span className="status-badge">{t('friends:search.requestSent')}</span>
                      )}
                      {user.relationshipStatus === 'accepted' && (
                        <span className="status-badge">{t('friends:search.friends')}</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Friends;
