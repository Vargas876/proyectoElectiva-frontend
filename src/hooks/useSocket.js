// src/hooks/useSocket.js
import { useContext } from 'react';
import { SocketContext } from '../context/SocketContext';

export const useSocket = () => {
  const context = useContext(SocketContext);
  
  if (!context) {
    throw new Error('useSocket debe ser usado dentro de SocketProvider');
  }
  
  return context;
};

export default useSocket;
