import apiClient from './api';

/**
 * Register a new user
 * @param {Object} userData - { username, email, password }
 * @returns {Promise} API response
 */
export const register = async (userData) => {
  const response = await apiClient.post('/auth/register', userData);
  return response.data;
};

/**
 * Login user
 * @param {Object} credentials - { username, password }
 * @returns {Promise} API response
 */
export const login = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

/**
 * Get current user profile
 * @returns {Promise} API response
 */
export const getMe = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};

/**
 * Update user profile
 * @param {Object} profileData - { privacy, bio, profilePicture }
 * @returns {Promise} API response
 */
export const updateProfile = async (profileData) => {
  const response = await apiClient.put('/auth/profile', profileData);
  return response.data;
};

/**
 * Logout user (client-side)
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
