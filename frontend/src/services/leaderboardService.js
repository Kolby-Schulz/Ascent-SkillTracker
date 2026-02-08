import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api/v1';

const leaderboardService = {
  /**
   * Get leaderboard data
   * @param {string} scope - 'friends' or 'all'
   * @param {string} category - Optional category filter
   * @param {string} tag - Optional tag filter
   */
  getLeaderboard: async (scope = 'all', category = null, tag = null) => {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams({ scope });
    if (category) params.append('category', category);
    if (tag) params.append('tag', tag);

    const response = await axios.get(`${API_URL}/leaderboard?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  /**
   * Get available filters (categories and tags)
   */
  getFilters: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/leaderboard/filters`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  /**
   * Record a skill/roadmap completion
   * @param {string} roadmapId
   * @param {string} roadmapName
   * @param {string} category
   * @param {Array<string>} tags
   * @param {Date} startedAt
   */
  recordCompletion: async (roadmapId, roadmapName, category = null, tags = [], startedAt = null) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/leaderboard/complete`,
      {
        roadmapId,
        roadmapName,
        category,
        tags,
        startedAt: startedAt ? startedAt.toISOString() : null,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
};

export default leaderboardService;
