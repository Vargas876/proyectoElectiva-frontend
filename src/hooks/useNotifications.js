// src/hooks/useNotifications.js
import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error('useNotifications debe ser usado dentro de NotificationProvider');
  }
  
  return context;
};

export default useNotifications;
