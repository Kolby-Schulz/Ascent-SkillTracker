import apiClient from './api';

/**
 * Get current user's metrics
 * @returns {Promise} { metrics: { skillsLearned, skillsInProgress, guidesUploaded, totalGuideViews }, guideBreakdown }
 */
export const getMyMetrics = async () => {
  const response = await apiClient.get('/metrics');
  return response.data?.data || response.data;
};
