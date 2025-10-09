import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import React, { useEffect, useRef, useState } from 'react';
import { useSocket } from '../../context/SocketContext';

const TripChat = ({ tripId, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const { socket, connected, joinTrip, sendMessage } = useSocket();

  useEffect(() => {
    if (connected && tripId) {
      // Unirse a la sala del viaje
      joinTrip(tripId);

      // Escuchar nuevos mensajes
      socket.on('new-message', (message) => {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      });

      return () => {
        socket.off('new-message');
      };
    }
  }, [connected, tripId, socket]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !connected) return;

    setSending(true);
    try {
      const messageData = {
        text: newMessage.trim(),
        sender_id: currentUser.id,
        sender_name: currentUser.name
      };

      sendMessage(tripId, messageData, currentUser);
      setNewMessage('');
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Chat del Viaje</h3>
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              connected ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className="text-sm text-gray-600">
            {connected ? 'Conectado' : 'Desconectado'}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>No hay mensajes aún</p>
            <p className="text-sm mt-2">Sé el primero en escribir</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isOwnMessage = message.sender_id === currentUser.id;
            
            return (
              <div
                key={message.id || index}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    isOwnMessage
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  {!isOwnMessage && (
                    <p className="text-xs font-semibold mb-1">
                      {message.sender_name}
                    </p>
                  )}
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {formatDistanceToNow(new Date(message.timestamp), {
                      addSuffix: true,
                      locale: es
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            disabled={!connected || sending}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!connected || sending || !newMessage.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {sending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              'Enviar'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TripChat;
