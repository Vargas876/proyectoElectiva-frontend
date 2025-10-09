// src/api/axios.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor de Request - Agregar token automáticamente
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Response - Manejar errores globalmente
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de error
      const { status, data } = error.response;
      
      if (status === 401) {
        // Token inválido o expirado
        localStorage.removeItem('token');
        localStorage.removeItem('driver');
        window.location.href = '/login';
      } else if (status === 403) {
        // Sin permisos
        console.error('Acceso denegado');
      } else if (status === 404) {
        console.error('Recurso no encontrado');
      } else if (status >= 500) {
        console.error('Error del servidor');
      }
      
      return Promise.reject(data || error);
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      console.error('Error de red - sin respuesta del servidor');
      return Promise.reject({
        success: false,
        message: 'Error de conexión. Verifica tu internet.'
      });
    } else {
      // Algo pasó al configurar la petición
      console.error('Error:', error.message);
      return Promise.reject(error);
    }
  }
);

export default axiosInstance;
