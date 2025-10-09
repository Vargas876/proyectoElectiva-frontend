import axios from './axios';

export const reviewApi = {
  // Obtener todos los reviews
  getAll: async (page = 1, limit = 10) => {
    try {
      return await axios.get(`/reviews?page=${page}&limit=${limit}`);
    } catch (error) {
      throw error;
    }
  },

  // Obtener reviews de un conductor
  getByDriver: async (driverId, page = 1, limit = 10) => {
    try {
      return await axios.get(`/reviews/driver/${driverId}?page=${page}&limit=${limit}`);
    } catch (error) {
      throw error;
    }
  },

  // Obtener review de un viaje específico
  getByTrip: async (tripId) => {
    try {
      return await axios.get(`/reviews/trip/${tripId}`);
    } catch (error) {
      throw error;
    }
  },

  // Crear un nuevo review
  create: async (reviewData) => {
    try {
      return await axios.post('/reviews', reviewData);
    } catch (error) {
      throw error;
    }
  },

  // Actualizar un review
  update: async (id, reviewData) => {
    try {
      return await axios.put(`/reviews/${id}`, reviewData);
    } catch (error) {
      throw error;
    }
  },

  // Eliminar un review
  delete: async (id) => {
    try {
      return await axios.delete(`/reviews/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Marcar review como útil
  markAsHelpful: async (id) => {
    try {
      return await axios.post(`/reviews/${id}/helpful`);
    } catch (error) {
      throw error;
    }
  }
};

export default reviewApi;
