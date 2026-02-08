import apiClient from './api';

export const friendService = {
  // Search users
  searchUsers: (query) => {
    return apiClient.get(`/friends/search?q=${encodeURIComponent(query)}`);
  },

  // Send friend request
  sendFriendRequest: (recipientId) => {
    return apiClient.post('/friends/request', { recipientId });
  },

  // Accept friend request
  acceptFriendRequest: (requestId) => {
    return apiClient.put(`/friends/accept/${requestId}`);
  },

  // Remove friend or reject request
  removeFriend: (requestId) => {
    return apiClient.delete(`/friends/${requestId}`);
  },

  // Get friends list
  getFriends: () => {
    return apiClient.get('/friends');
  },

  // Get pending friend requests
  getFriendRequests: () => {
    return apiClient.get('/friends/requests');
  },

  // Get all users (for testing)
  getAllUsers: () => {
    return apiClient.get('/friends/all');
  },
};

export default friendService;
