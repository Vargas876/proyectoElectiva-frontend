import { io } from 'socket.io-client';
import { SOCKET_URL } from '../utils/constants';

let socket = null;

export const initializeSocket = (token) => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
      console.log('✅ Socket conectado:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket desconectado');
    });

    socket.on('connect_error', (error) => {
      console.error('Error de conexión:', error);
    });
  }
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export default {
  initializeSocket,
  getSocket,
  disconnectSocket
};