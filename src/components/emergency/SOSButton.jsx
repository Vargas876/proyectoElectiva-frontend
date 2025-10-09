// src/components/emergency/SOSButton.jsx
import React, { useState } from 'react';
import { emergencyApi } from '../../api/emergencyApi';
import { useSocket } from '../../context/SocketContext';

const SOSButton = ({ tripId, driverId }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState('accident');
  const [description, setDescription] = useState('');
  const { triggerSOS } = useSocket();

  const handleActivateSOS = async () => {
    if (!confirm('¿Estás seguro de activar la alerta SOS? Esto notificará a las autoridades y tus contactos de emergencia.')) {
      return;
    }

    setLoading(true);
    try {
      // Obtener ubicación actual
      const location = await new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocalización no soportada'));
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              address: 'Ubicación actual'
            });
          },
          (error) => {
            reject(error);
          }
        );
      });

      // Enviar alerta al servidor
      await emergencyApi.triggerSOS({
        trip_id: tripId,
        location,
        reason,
        description
      });

      // Emitir evento de Socket.IO
      triggerSOS(tripId, driverId, location);

      alert('✅ Alerta SOS activada. Se ha notificado a las autoridades y tus contactos de emergencia.');
      setShowModal(false);
    } catch (error) {
      console.error('Error al activar SOS:', error);
      alert('❌ Error al activar SOS: ' + (error.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* SOS Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg flex items-center justify-center text-2xl font-bold animate-pulse z-50 transition-all hover:scale-110"
        title="Botón de Emergencia SOS"
      >
        SOS
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-red-600 flex items-center">
                <span className="text-3xl mr-2">🚨</span>
                Alerta de Emergencia
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Emergencia
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  disabled={loading}
                >
                  <option value="accident">Accidente</option>
                  <option value="medical">Emergencia Médica</option>
                  <option value="security">Problema de Seguridad</option>
                  <option value="vehicle_problem">Problema del Vehículo</option>
                  <option value="other">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción (Opcional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe brevemente la situación..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  disabled={loading}
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  ⚠️ Al activar esta alerta se notificará a:
                </p>
                <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
                  <li>Autoridades locales</li>
                  <li>Tus contactos de emergencia</li>
                  <li>Administradores de la plataforma</li>
                </ul>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleActivateSOS}
                  disabled={loading}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Activando...
                    </span>
                  ) : (
                    'Activar SOS'
                  )}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SOSButton;
