import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getSocket } from '../services/socket';
import { AuthContext } from './AuthContext';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user) {
      const socketInstance = getSocket();
      setSocket(socketInstance);

      // Eventos para pasajeros
      if (user.role === 'passenger') {
        socketInstance?.on('new_offer', (data) => {
          toast.success(`Nueva oferta: $${data.offered_price}`);
          setNotifications(prev => [...prev, data]);
        });

        socketInstance?.on('offer_accepted', (data) => {
          toast.success('¡Tu viaje ha sido confirmado!');
        });
      }

      // Eventos para conductores
      if (user.role === 'driver') {
        socketInstance?.on('new_trip_request', (data) => {
          toast('Nueva solicitud de viaje disponible', {
            icon: '🚗',
          });
          setNotifications(prev => [...prev, data]);
        });

        socketInstance?.on('offer_accepted', (data) => {
          toast.success('¡Tu oferta fue aceptada!');
        });

        socketInstance?.on('offer_rejected', (data) => {
          toast.error('Tu oferta fue rechazada');
        });
      }

      return () => {
        socketInstance?.off('new_offer');
        socketInstance?.off('offer_accepted');
        socketInstance?.off('new_trip_request');
        socketInstance?.off('offer_rejected');
      };
    }
  }, [user]);

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <SocketContext.Provider value={{ socket, notifications, clearNotifications }}>
      {children}
    </SocketContext.Provider>
  );
};