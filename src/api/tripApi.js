import axios from '../utils/axios';

export const tripApi = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await axios.get(`/trips?${params}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`/trips/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await axios.post('/trips', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axios.put(`/trips/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`/trips/${id}`);
    return response.data;
  },

  addPassenger: async (id, passenger) => {
    const response = await axios.post(`/trips/${id}/passengers`, passenger);
    return response.data;
  },

  rateTrip: async (id, rating) => {
    const response = await axios.post(`/trips/${id}/rate`, { rating });
    return response.data;
  },

  getStatistics: async (driverId = null) => {
    const url = driverId 
      ? `/trips/statistics?driver_id=${driverId}`
      : '/trips/statistics';
    const response = await axios.get(url);
    return response.data;
  }
};  