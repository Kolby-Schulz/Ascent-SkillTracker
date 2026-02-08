import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import friendService from '../services/friendService';
import './Friends.css';

const Friends = () => {
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
      setFriends(response.data.friends || []);
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
      setRequests(response.data.requests || []);
    } catch (error) {
      console.error('Error loading friend requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.length < 2) return;

    setLoading(true);
    try {
      const response = await friendService.searchUsers(searchQuery);
      setSearchResults(response.data.users || []);
    } catch (error) {
      console.error('Error searching users:', error);
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
      alert('Friend request sent!');
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert(error.response?.data?.error || 'Failed to send friend request');
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await friendService.acceptFriendRequest(requestId);
      setRequests(requests.filter((req) => req.id !== requestId));
      loadFriends(); // Refresh friends list
      alert('Friend request accepted!');
    } catch (error) {
      console.error('Error accepting request:', error);
      alert('Failed to accept friend request');
    }
  };

  const handleRemoveFriend = async (friendshipId) => {
    if (!window.confirm('Are you sure you want to remove this friend?')) return;

    try {
      await friendService.removeFriend(friendshipId);
      setFriends(friends.filter((f) => f.friendshipId !== friendshipId));
      alert('Friend removed');
    } catch (error) {
      console.error('Error removing friend:', error);
      alert('Failed to remove friend');
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
        <h1 className="friends-title">Friends</h1>
        <p className="friends-subtitle">Manage your connections and discover new friends</p>
      </div>

      <div className="friends-tabs">
        <button
          className={`friends-tab ${activeTab === 'friends' ? 'active' : ''}`}
          onClick={() => setActiveTab('friends')}
        >
          My Friends ({friends.length})
        </button>
        <button
          className={`friends-tab ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          Requests ({requests.length})
        </button>
        <button
          className={`friends-tab ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          Search Users
        </button>
      </div>

      <div className="friends-content">
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        )}

        {!loading && activeTab === 'friends' && (
          <div className="friends-list">
            {friends.length === 0 ? (
              <div className="empty-state">
                <p>You don't have any friends yet. Search for users to add friends!</p>
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
                    title="Remove friend"
                  >
                    Remove
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
                <p>No pending friend requests</p>
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
                      Accept
                    </button>
                    <button
                      className="reject-button"
                      onClick={() => handleRemoveFriend(request.id)}
                    >
                      Reject
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
                placeholder="Search by username or email..."
                className="search-input"
              />
              <button type="submit" className="search-button">
                Search
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
                        <span className="privacy-badge">Private</span>
                      )}
                    </div>
                    <div className="user-actions">
                      {user.relationshipStatus === null && (
                        <button
                          className="add-friend-button"
                          onClick={() => handleSendRequest(user.id)}
                        >
                          Add Friend
                        </button>
                      )}
                      {user.relationshipStatus === 'pending' && (
                        <span className="status-badge">Request Sent</span>
                      )}
                      {user.relationshipStatus === 'accepted' && (
                        <span className="status-badge">Friends</span>
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
