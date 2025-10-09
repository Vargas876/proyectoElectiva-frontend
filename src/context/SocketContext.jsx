import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const socketInstance = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketInstance.on('connect', () => {
        console.log('✅ Socket conectado:', socketInstance.id);
        setConnected(true);
      });

      socketInstance.on('disconnect', () => {
        console.log('❌ Socket desconectado');
        setConnected(false);
      });

      socketInstance.on('connect_error', (error) => {
        console.error('❌ Error de conexión Socket.IO:', error);
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setConnected(false);
      }
    }
  }, [user]);

  // AGREGAR función joinTrip
  const joinTrip = (tripId) => {
    if (socket && connected) {
      socket.emit('join_trip', tripId);
      console.log(`👤 Unido al viaje: ${tripId}`);
    } else {
      console.warn('⚠️ Socket no conectado, no se puede unir al viaje');
    }
  };

  // AGREGAR función leaveTrip
  const leaveTrip = (tripId) => {
    if (socket && connected) {
      socket.emit('leave_trip', tripId);
      console.log(`👋 Salió del viaje: ${tripId}`);
    }
  };

  //  AGREGAR función sendMessage
  const sendMessage = (tripId, message) => {
    if (socket && connected) {
      socket.emit('send_message', { tripId, message });
      console.log(`📤 Mensaje enviado al viaje ${tripId}`);
    } else {
      console.warn('⚠️ Socket no conectado, no se puede enviar mensaje');
    }
  };

  const value = {
    socket,
    connected,
    joinTrip,      
    leaveTrip,    
    sendMessage    
  };

  return (
    <SocketContext.Provider value={value}>
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
