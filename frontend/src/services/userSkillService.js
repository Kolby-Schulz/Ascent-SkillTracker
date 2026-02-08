import apiClient from './api';

export const userSkillService = {
  /** Get current user's skill progress list from backend (source of truth) */
  getMyProgress: () => apiClient.get('/user-skills'),

  /** Get other users (in DB) who are learning this skill by name */
  getUsersLearningSkill: (skillName) => {
    return apiClient.get('/user-skills/learning', {
      params: { skillName },
    });
  },

  /** Add or update current user's skill progress (so they appear for others) */
  upsertSkill: (skillName, status = 'in_progress') => {
    return apiClient.post('/user-skills', { skillName, status });
  },

  /** Remove current user's skill progress (so they no longer appear on friends' cards) */
  removeSkill: (skillName) => {
    return apiClient.delete('/user-skills', { params: { skillName } });
  },
};

export default userSkillService;
