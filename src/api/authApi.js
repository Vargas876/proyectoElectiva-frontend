// src/api/authApi.js
import axios from './axios';

export const authApi = {
  // Login
  login: async (email, license_number) => {
    try {
      // axios ya devuelve response.data gracias al interceptor
      return await axios.post('/auth/login', { email, license_number });
    } catch (error) {
      throw error;
    }
  },

  // Register
  register: async (userData) => {
    try {
      return await axios.post('/auth/register', userData);
    } catch (error) {
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      return await axios.post('/auth/logout');
    } catch (error) {
      throw error;
    }
  },

  // Verificar token
  verifyToken: async () => {
    try {
      return await axios.get('/auth/verify');
    } catch (error) {
      throw error;
    }
  },

  // Obtener usuario actual
  getCurrentUser: async () => {
    try {
      return await axios.get('/auth/me');
    } catch (error) {
      throw error;
    }
  }
};

export default authApi;
