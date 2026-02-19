import api from './api';

export const tournamentService = {
  getTournaments: async (params = {}) => {
    const { data } = await api.get('/tournaments', { params });
    return data;
  },

  getTournamentById: async (id) => {
    const { data } = await api.get(`/tournaments/${id}`);
    return data;
  },

  createTournament: async (tournamentData) => {
    const { data } = await api.post('/tournaments', tournamentData);
    return data;
  },

  registerForTournament: async (id) => {
    const { data } = await api.post(`/tournaments/${id}/register`);
    return data;
  },

  unregisterFromTournament: async (id) => {
    const { data } = await api.delete(`/tournaments/${id}/register`);
    return data;
  },

  updateTournamentStatus: async (id, status) => {
    const { data } = await api.patch(`/tournaments/${id}/status`, { status });
    return data;
  },

  deleteTournament: async (id) => {
    const { data } = await api.delete(`/tournaments/${id}`);
    return data;
  },
};

export const matchService = {
  getMatches: async (params = {}) => {
    const { data } = await api.get('/matches', { params });
    return data;
  },

  getMatchById: async (id) => {
    const { data } = await api.get(`/matches/${id}`);
    return data;
  },

  createMatch: async (matchData) => {
    const { data } = await api.post('/matches', matchData);
    return data;
  },

  joinMatch: async (id, password = '') => {
    const { data } = await api.post(`/matches/${id}/join`, { password });
    return data;
  },

  leaveMatch: async (id) => {
    const { data } = await api.delete(`/matches/${id}/leave`);
    return data;
  },

  updateMatchStatus: async (id, status) => {
    const { data } = await api.patch(`/matches/${id}/status`, { status });
    return data;
  },
};

export const chatService = {
  getRooms: async () => {
    const { data } = await api.get('/chat/rooms');
    return data;
  },

  getMessages: async (roomId, params = {}) => {
    const { data } = await api.get(`/chat/messages/${roomId}`, { params });
    return data;
  },
};
