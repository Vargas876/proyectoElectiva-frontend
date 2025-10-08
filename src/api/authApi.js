import axios from '../utils/axios';

export const authApi = {
  register: async (data) => {
    const response = await axios.post('/auth/register', data);
    return response.data;
  },

  login: async (email, license_number) => {
    const response = await axios.post('/auth/login', { 
      email, 
      license_number 
    });
    return response.data;
  },

  verifyToken: async () => {
    const response = await axios.get('/auth/verify');
    return response.data;
  }
};