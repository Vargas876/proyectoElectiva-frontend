// src/api/rewardApi.js
import axios from './axios';

export const rewardApi = {
  // Obtener recompensas del usuario actual
  getRewards: async () => {
    try {
      return await axios.get('/rewards/my-rewards');
    } catch (error) {
      throw error;
    }
  },

  // Obtener recompensas de un conductor específico
  getByDriver: async (driverId) => {
    try {
      return await axios.get(`/rewards/driver/${driverId}`);
    } catch (error) {
      throw error;
    }
  },

  // Obtener leaderboard
  getLeaderboard: async (limit = 10, sortBy = 'points') => {
    try {
      return await axios.get(`/rewards/leaderboard?limit=${limit}&sortBy=${sortBy}`);
    } catch (error) {
      throw error;
    }
  },

  // Reclamar badge
  claimBadge: async (badgeId) => {
    try {
      return await axios.post(`/rewards/claim-badge/${badgeId}`);
    } catch (error) {
      throw error;
    }
  },

  // Obtener logros disponibles
  getAchievements: async () => {
    try {
      return await axios.get('/rewards/achievements');
    } catch (error) {
      throw error;
    }
  }
};

export default rewardApi;
