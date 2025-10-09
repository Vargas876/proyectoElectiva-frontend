import axios from './axios';

export const tripApi = {
  // Obtener todos los viajes
  getAll: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `/trips?${queryString}` : '/trips';
      return await axios.get(url);
    } catch (error) {
      throw error;
    }
  },

  // Obtener un viaje por ID
  getById: async (id) => {
    try {
      return await axios.get(`/trips/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Crear un nuevo viaje
  create: async (tripData) => {
    try {
      return await axios.post('/trips', tripData);
    } catch (error) {
      throw error;
    }
  },

  // Actualizar un viaje
  update: async (id, tripData) => {
    try {
      return await axios.put(`/trips/${id}`, tripData);
    } catch (error) {
      throw error;
    }
  },

  // Eliminar un viaje
  delete: async (id) => {
    try {
      return await axios.delete(`/trips/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Buscar viajes (con filtros)
  search: async (filters) => {
    try {
      const queryString = new URLSearchParams(filters).toString();
      return await axios.get(`/trips/search?${queryString}`);
    } catch (error) {
      throw error;
    }
  },

  // Obtener viajes de un conductor específico
  getByDriver: async (driverId) => {
    try {
      return await axios.get(`/trips/driver/${driverId}`);
    } catch (error) {
      throw error;
    }
  },

  // Cancelar un viaje
  cancel: async (id) => {
    try {
      return await axios.patch(`/trips/${id}/cancel`);
    } catch (error) {
      throw error;
    }
  },

  // Iniciar un viaje
  start: async (id) => {
    try {
      return await axios.patch(`/trips/${id}/start`);
    } catch (error) {
      throw error;
    }
  },

  // Completar un viaje
  complete: async (id) => {
    try {
      return await axios.patch(`/trips/${id}/complete`);
    } catch (error) {
      throw error;
    }
  },

  // Reservar asientos en un viaje
  reserve: async (id, reservationData) => {
    try {
      return await axios.post(`/trips/${id}/reserve`, reservationData);
    } catch (error) {
      throw error;
    }
  },

  // Obtener estadísticas de viajes
  getStats: async () => {
    try {
      return await axios.get('/trips/stats');
    } catch (error) {
      throw error;
    }
  }
};

export default tripApi;
