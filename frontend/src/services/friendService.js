import api from './api';

export const friendService = {
  // Search users
  searchUsers: (query) => {
    return api.get(`/friends/search?q=${encodeURIComponent(query)}`);
  },

  // Send friend request
  sendFriendRequest: (recipientId) => {
    return api.post('/friends/request', { recipientId });
  },

  // Accept friend request
  acceptFriendRequest: (requestId) => {
    return api.put(`/friends/accept/${requestId}`);
  },

  // Remove friend or reject request
  removeFriend: (requestId) => {
    return api.delete(`/friends/${requestId}`);
  },

  // Get friends list
  getFriends: () => {
    return api.get('/friends');
  },

  // Get pending friend requests
  getFriendRequests: () => {
    return api.get('/friends/requests');
  },
};

export default friendService;
