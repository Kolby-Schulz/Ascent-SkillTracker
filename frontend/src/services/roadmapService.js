import api from './api';

const roadmapService = {
  // Create a new roadmap
  createRoadmap: async (roadmapData) => {
    try {
      const response = await api.post('/roadmaps', roadmapData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get all public roadmaps
  getRoadmaps: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/roadmaps?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user's own roadmaps
  getMyRoadmaps: async (status) => {
    try {
      const params = status ? `?status=${status}` : '';
      const response = await api.get(`/roadmaps/user/my-roadmaps${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get a single roadmap by ID
  getRoadmapById: async (id) => {
    try {
      const response = await api.get(`/roadmaps/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update a roadmap
  updateRoadmap: async (id, roadmapData) => {
    try {
      const response = await api.put(`/roadmaps/${id}`, roadmapData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete a roadmap
  deleteRoadmap: async (id) => {
    try {
      const response = await api.delete(`/roadmaps/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Publish a roadmap
  publishRoadmap: async (id) => {
    try {
      const response = await api.put(`/roadmaps/${id}/publish`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Unpublish a roadmap
  unpublishRoadmap: async (id) => {
    try {
      const response = await api.put(`/roadmaps/${id}/unpublish`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Like or unlike a roadmap (toggle)
  likeRoadmap: async (id) => {
    try {
      const response = await api.put(`/roadmaps/${id}/like`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default roadmapService;
