// src/context/SocketContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Crear conexión de socket
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket conectado:', newSocket.id);
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Socket desconectado');
      setConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Error de conexión Socket:', error);
      setConnected(false);
    });

    setSocket(newSocket);

    // Cleanup al desmontar
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  const joinTrip = (tripId) => {
    if (socket && connected) {
      socket.emit('join-trip', tripId);
    }
  };

  const sendMessage = (tripId, message, sender) => {
    if (socket && connected) {
      socket.emit('send-message', { tripId, message, sender });
    }
  };

  const updateLocation = (tripId, location) => {
    if (socket && connected) {
      socket.emit('update-location', { tripId, location });
    }
  };

  const triggerSOS = (tripId, driverId, location) => {
    if (socket && connected) {
      socket.emit('trigger-sos', { tripId, driverId, location });
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        joinTrip,
        sendMessage,
        updateLocation,
        triggerSOS
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket debe ser usado dentro de SocketProvider');
  }
  return context;
};

export default SocketContext;
