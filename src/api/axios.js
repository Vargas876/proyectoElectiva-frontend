// src/api/axios.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token JWT en cada request
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

// ✅ INTERCEPTOR CORREGIDO
axiosInstance.interceptors.response.use(
  (response) => {
    // ✅ CAMBIO: Devolver response.data directamente
    return response.data;
  },
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de error
      const message = error.response.data?.message || error.response.data?.error || 'Error en la solicitud';
      
      console.error('Error del servidor:', message);
      
      // Si es 401 (no autorizado), limpiar token y redirigir al login
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      // Si es 403 (prohibido)
      if (error.response.status === 403) {
        console.error('Acceso denegado');
      }
      
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // La solicitud fue hecha pero no hubo respuesta
      console.error('Error de red - sin respuesta del servidor');
      return Promise.reject(new Error('No se pudo conectar con el servidor'));
    } else {
      // Algo sucedió al configurar la solicitud
      console.error('Error de configuración:', error.message);
      return Promise.reject(new Error(error.message || 'Error desconocido'));
    }
  }
);

export default axiosInstance;
