import apiClient from './api';

const FALLBACK_METRICS = {
  metrics: {
    skillsLearned: 0,
    skillsInProgress: 0,
    guidesUploaded: 0,
    totalGuideViews: 0,
    totalGuideLikes: 0,
    totalRoadmapLikes: 0,
    totalLikes: 0,
  },
  fromFallback: true,
};

/**
 * Get current user's metrics. Returns fallback on error (e.g. blocked by ad blocker) so UI never breaks.
 * @returns {Promise} { metrics, fromFallback?: boolean }
 */
export const getMyMetrics = async () => {
  try {
    const response = await apiClient.get('/metrics');
    const data = response.data?.data || response.data;
    return data ? { ...data, fromFallback: false } : FALLBACK_METRICS;
  } catch (err) {
    // ERR_BLOCKED_BY_CLIENT = ad blocker / extension; ERR_NETWORK = backend down
    return { ...FALLBACK_METRICS, error: err };
  }
};
