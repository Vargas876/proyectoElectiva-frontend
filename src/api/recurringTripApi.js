// src/api/recurringTripApi.js
import axios from './axios';

export const recurringTripApi = {
  // Obtener todos los viajes recurrentes
  getAll: async () => {
    try {
      return await axios.get('/recurring-trips');
    } catch (error) {
      throw error;
    }
  },

  // Obtener viajes recurrentes de un conductor
  getByDriver: async (driverId) => {
    try {
      return await axios.get(`/recurring-trips/driver/${driverId}`);
    } catch (error) {
      throw error;
    }
  },

  // Crear viaje recurrente
  create: async (tripData) => {
    try {
      return await axios.post('/recurring-trips', tripData);
    } catch (error) {
      throw error;
    }
  },

  // Actualizar viaje recurrente
  update: async (id, tripData) => {
    try {
      return await axios.put(`/recurring-trips/${id}`, tripData);
    } catch (error) {
      throw error;
    }
  },

  // Eliminar viaje recurrente
  delete: async (id) => {
    try {
      return await axios.delete(`/recurring-trips/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Activar/desactivar viaje recurrente
  toggleActive: async (id) => {
    try {
      return await axios.patch(`/recurring-trips/${id}/toggle`);
    } catch (error) {
      throw error;
    }
  }
};

export default recurringTripApi;
