// src/api/emergencyApi.js
import axios from './axios';

export const emergencyApi = {
  // Activar alerta SOS
  triggerSOS: async (emergencyData) => {
    try {
      return await axios.post('/emergency/sos', emergencyData);
    } catch (error) {
      throw error;
    }
  },

  // Obtener alertas de emergencia
  getAlerts: async () => {
    try {
      return await axios.get('/emergency/alerts');
    } catch (error) {
      throw error;
    }
  },

  // Actualizar estado de alerta
  updateAlert: async (id, status) => {
    try {
      return await axios.patch(`/emergency/alerts/${id}`, { status });
    } catch (error) {
      throw error;
    }
  },

  // Resolver alerta
  resolveAlert: async (id) => {
    try {
      return await axios.patch(`/emergency/alerts/${id}/resolve`);
    } catch (error) {
      throw error;
    }
  }
};

export default emergencyApi;
