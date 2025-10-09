import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';

const TripChat = ({ tripId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const { socket, connected, joinTrip, sendMessage } = useSocket();
  const { user } = useAuth();

  // Auto-scroll al último mensaje
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Unirse al viaje cuando el componente se monta
  useEffect(() => {
    if (connected && tripId) {
      console.log('🔌 Uniéndose al chat del viaje:', tripId);
      joinTrip(tripId);
    }

    return () => {
      // Opcional: salir del viaje cuando el componente se desmonta
      // socket?.emit('leave_trip', tripId);
    };
  }, [connected, tripId, joinTrip]);

  // ✅ ESCUCHAR MENSAJES NUEVOS
  useEffect(() => {
    if (!socket) return;

    console.log('👂 Escuchando evento new_message...');

    const handleNewMessage = (data) => {
      console.log('📨 Mensaje recibido en frontend:', data);
      
      setMessages((prevMessages) => [...prevMessages, {
        id: Date.now() + Math.random(),
        message: data.message,
        sender: data.sender || { name: 'Usuario' },
        timestamp: data.timestamp || new Date().toISOString(),
        isOwn: data.sender?.id === user?.id
      }]);
    };

    // Agregar listener
    socket.on('new_message', handleNewMessage);

    // Cleanup
    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [socket, user]);

  // ✅ ENVIAR MENSAJE
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !connected) {
      console.warn('⚠️ No se puede enviar: mensaje vacío o socket desconectado');
      return;
    }

    console.log('📤 Enviando mensaje:', newMessage);

    const messageData = {
      tripId,
      message: newMessage.trim(),
      sender: {
        id: user?.id || 'unknown',
        name: user?.name || 'Usuario',
        email: user?.email
      }
    };

    // Enviar mensaje via Socket.IO
    sendMessage(tripId, messageData);

    // Limpiar input
    setNewMessage('');
  };

  if (!connected) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">⚠️ Conectando al chat...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-xl font-bold mb-4 text-gray-800">💬 Chat del Viaje</h3>

      {/* Área de mensajes */}
      <div className="border border-gray-200 rounded-lg h-96 overflow-y-auto p-4 mb-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No hay mensajes aún</p>
            <p className="text-sm">Sé el primero en enviar un mensaje</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-3 ${msg.isOwn ? 'text-right' : 'text-left'}`}
            >
              <div
                className={`inline-block max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.isOwn
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                <p className="font-semibold text-sm">{msg.sender.name}</p>
                <p className="mt-1">{msg.message}</p>
                <p className="text-xs mt-1 opacity-75">
                  {new Date(msg.timestamp).toLocaleTimeString('es-CO', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Formulario de envío */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!connected}
        />
        <button
          type="submit"
          disabled={!connected || !newMessage.trim()}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Enviar
        </button>
      </form>

      {/* Indicador de conexión */}
      <div className="mt-2 text-xs text-gray-500">
        {connected ? (
          <span className="text-green-600">● Conectado</span>
        ) : (
          <span className="text-red-600">● Desconectado</span>
        )}
      </div>
    </div>
  );
};

export default TripChat;
