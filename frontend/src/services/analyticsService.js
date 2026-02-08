import apiClient from './api';

export const analyticsService = {
  getAnalytics: () => {
    return apiClient.get('/analytics');
  },
};

export default analyticsService;
