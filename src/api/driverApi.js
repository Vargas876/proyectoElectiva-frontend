// src/api/driverApi.js
import axios from './axios';

export const driverApi = {
  // Obtener todos los conductores
  getAll: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `/drivers?${queryString}` : '/drivers';
      return await axios.get(url);
    } catch (error) {
      throw error;
    }
  },

  // Obtener un conductor por ID
  getById: async (id) => {
    try {
      return await axios.get(`/drivers/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Crear un nuevo conductor
  create: async (driverData) => {
    try {
      return await axios.post('/drivers', driverData);
    } catch (error) {
      throw error;
    }
  },

  // Actualizar un conductor
  update: async (id, driverData) => {
    try {
      return await axios.put(`/drivers/${id}`, driverData);
    } catch (error) {
      throw error;
    }
  },

  // Eliminar un conductor
  delete: async (id) => {
    try {
      return await axios.delete(`/drivers/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Buscar conductores
  search: async (query) => {
    try {
      return await axios.get(`/drivers/search?q=${query}`);
    } catch (error) {
      throw error;
    }
  },

  // Actualizar estado del conductor
  updateStatus: async (id, status) => {
    try {
      return await axios.patch(`/drivers/${id}/status`, { status });
    } catch (error) {
      throw error;
    }
  },

  // Obtener estadísticas de un conductor
  getStats: async (id) => {
    try {
      return await axios.get(`/drivers/${id}/stats`);
    } catch (error) {
      throw error;
    }
  }
};

export default driverApi;
