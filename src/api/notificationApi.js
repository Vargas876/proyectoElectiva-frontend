import axios from './axios';

export const notificationApi = {
  // Obtener todas las notificaciones del usuario
  getAll: async (page = 1, limit = 20) => {
    try {
      return await axios.get(`/notifications?page=${page}&limit=${limit}`);
    } catch (error) {
      throw error;
    }
  },

  // Marcar notificación como leída
  markAsRead: async (id) => {
    try {
      return await axios.patch(`/notifications/${id}/read`);
    } catch (error) {
      throw error;
    }
  },

  // Marcar todas como leídas
  markAllAsRead: async () => {
    try {
      return await axios.patch('/notifications/read-all');
    } catch (error) {
      throw error;
    }
  },

  // Eliminar notificación
  delete: async (id) => {
    try {
      return await axios.delete(`/notifications/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Obtener contador de no leídas
  getUnreadCount: async () => {
    try {
      return await axios.get('/notifications/unread-count');
    } catch (error) {
      throw error;
    }
  }
};

export default notificationApi;
