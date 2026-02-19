import api from './api';

export const userService = {
  getProfile: async () => {
    const { data } = await api.get('/users/profile');
    return data;
  },

  updateProfile: async (profileData) => {
    const { data } = await api.put('/users/profile', profileData);
    return data;
  },

  getUserStats: async (userId) => {
    const { data } = await api.get(`/users/${userId}/stats`);
    return data;
  },
};
