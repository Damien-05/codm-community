import api from './api';

export const achievementService = {
  getAllAchievements: async () => {
    const { data } = await api.get('/achievements/all');
    return data;
  },

  getUserAchievements: async (userId) => {
    const { data } = await api.get(`/achievements/user/${userId}`);
    return data;
  },

  checkAchievements: async () => {
    const { data } = await api.post('/achievements/check');
    return data;
  },

  getLeaderboard: async (limit = 100) => {
    const { data } = await api.get('/achievements/leaderboard', {
      params: { limit },
    });
    return data;
  },

  getEloHistory: async (userId, limit = 50) => {
    const { data } = await api.get(`/achievements/elo-history/${userId}`, {
      params: { limit },
    });
    return data;
  },
};
