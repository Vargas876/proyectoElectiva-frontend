// src/context/NotificationContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { notificationApi } from '../api/notificationApi';
import { useSocket } from './SocketContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { socket } = useSocket();

  // Cargar notificaciones iniciales
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationApi.getAll(1, 20);
      setNotifications(response.data);
      setUnreadCount(response.unread_count);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Escuchar nuevas notificaciones por Socket.IO
  useEffect(() => {
    if (socket) {
      socket.on('new-notification', (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
        
        // Mostrar notificación del navegador
        if (Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/logo.png'
          });
        }
      });

      return () => {
        socket.off('new-notification');
      };
    }
  }, [socket]);

  // Marcar como leída
  const markAsRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications(prev =>
        prev.map(notif =>
          notif._id === id ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error al marcar como leída:', error);
    }
  };

  // Marcar todas como leídas
  const markAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error al marcar todas como leídas:', error);
    }
  };

  // Eliminar notificación
  const deleteNotification = async (id) => {
    try {
      await notificationApi.delete(id);
      setNotifications(prev => prev.filter(notif => notif._id !== id));
      const deletedNotif = notifications.find(n => n._id === id);
      if (deletedNotif && !deletedNotif.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error al eliminar notificación:', error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification
      }}
    >
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
