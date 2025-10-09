import axios from 'axios';
import { API_URL } from '../utils/constants';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  verify: () => api.get('/auth/verify')
};

// Trip Requests (Pasajero)
export const tripRequestAPI = {
  create: (data) => api.post('/trip-requests', data),
  getMyRequests: () => api.get('/trip-requests/my-requests'),
  getById: (id) => api.get(`/trip-requests/${id}`),
  acceptOffer: (requestId, offerId) => 
    api.post(`/trip-requests/${requestId}/accept-offer`, { offerId }),
  cancel: (id) => api.put(`/trip-requests/${id}/cancel`),
  complete: (id) => api.put(`/trip-requests/${id}/complete`),
  rateDriver: (id, rating) => api.post(`/trip-requests/${id}/rate`, { rating })
};

// Driver Offers (Conductor)
export const driverAPI = {
  getAvailableRequests: () => api.get('/trip-requests/available'),
  makeOffer: (requestId, data) => 
    api.post(`/trip-requests/${requestId}/offer`, data),
  getMyOffers: () => api.get('/trip-requests/my-offers'),
  updateOffer: (requestId, offerId, data) => 
    api.put(`/trip-requests/${requestId}/offer/${offerId}`, data),
  cancelOffer: (requestId, offerId) => 
    api.delete(`/trip-requests/${requestId}/offer/${offerId}`)
};

export default api;