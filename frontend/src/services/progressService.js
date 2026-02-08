import apiClient from './api';

export const progressService = {
  // Track step start
  startStep: (roadmapId, stepIndex) => {
    return apiClient.post('/progress/start', { roadmapId, stepIndex });
  },

  // Track step completion
  completeStep: (roadmapId, stepIndex) => {
    return apiClient.post('/progress/complete', { roadmapId, stepIndex });
  },

  // Get friend progress for a roadmap
  getFriendProgress: (roadmapId) => {
    return apiClient.get(`/progress/friends/${roadmapId}`);
  },
};

export default progressService;
