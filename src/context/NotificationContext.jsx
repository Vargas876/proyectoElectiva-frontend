import React, { createContext, useContext, useEffect, useState } from 'react';
import { notificationApi } from '../api/notificationApi';
import { useAuth } from './AuthContext'; // ✅ AGREGAR
import { useSocket } from './SocketContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { socket } = useSocket();
  const { user } = useAuth(); 

  useEffect(() => {
    //  SOLO cargar notificaciones si el usuario está autenticado
    if (user) {
      fetchNotifications();
    }
  }, [user]); 

  useEffect(() => {
    // SOLO escuchar socket si hay usuario autenticado
    if (socket && user) {
      socket.on('new_notification', (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
        
        // Mostrar notificación del navegador
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/logo.png'
          });
        }
      });

      return () => {
        socket.off('new_notification');
      };
    }
  }, [socket, user]); // ✅ AGREGAR user a las dependencias

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationApi.getAll(1, 20);
      setNotifications(response.data || []);
      setUnreadCount(response.data?.filter(n => !n.read).length || 0);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error al marcar como leída:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error al marcar todas como leídas:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await notificationApi.delete(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (error) {
      console.error('Error al eliminar notificación:', error);
    }
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications debe ser usado dentro de NotificationProvider');
  }
  return context;
};

export default NotificationContext;
