// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Solicitar permisos de notificación del navegador
if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission().then(permission => {
    console.log('Notificaciones:', permission);
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
