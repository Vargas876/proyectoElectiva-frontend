import axios from '../utils/axios';

export const driverApi = {
  getAll: async () => {
    const response = await axios.get('/drivers');
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`/drivers/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await axios.post('/drivers', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axios.put(`/drivers/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`/drivers/${id}`);
    return response.data;
  }
};