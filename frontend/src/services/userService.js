import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api/v1';

const userService = {
  /**
   * Get user profile by ID
   * @param {string} userId - User ID
   */
  getUserProfile: async (userId) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/auth/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};

export default userService;
