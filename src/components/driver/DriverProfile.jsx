import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { driverApi } from '../../api/driverApi';
import ErrorMessage from '../common/ErrorMessage';
import Loader from '../common/Loader';
import ReviewList from '../review/ReviewList';

const DriverProfile = () => {
  const { id } = useParams();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('info'); // 'info', 'reviews', 'stats'

  useEffect(() => {
    fetchDriver();
  }, [id]);

  const fetchDriver = async () => {
    try {
      setLoading(true);
      const response = await driverApi.getById(id);
      setDriver(response.data);
    } catch (error) {
      setError(error.message || 'Error al cargar el conductor');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader size="lg" text="Cargando perfil..." />;
  }

  if (error || !driver) {
    return <ErrorMessage message={error || 'Conductor no encontrado'} />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          {/* Avatar */}
          {driver.profile_picture ? (
            <img
              src={driver.profile_picture}
              alt={driver.name}
              className="w-32 h-32 rounded-full object-cover"
            />
          ) : (
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-5xl font-bold">
              {driver.name?.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{driver.name}</h1>
              {driver.is_trusted && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                  ⭐ Conductor Confiable
                </span>
              )}
            </div>

            <div className="flex items-center space-x-4 text-gray-600 mb-3">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-semibold">{driver.rating?.toFixed(1)}</span>
              </div>
              <span>•</span>
              <span>{driver.total_trips} viajes</span>
              <span>•</span>
              <span>Nivel {driver.level || 1}</span>
            </div>

            {driver.bio && (
              <p className="text-gray-700">{driver.bio}</p>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center bg-blue-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-blue-600">{driver.completed_trips}</p>
              <p className="text-xs text-gray-600">Completados</p>
            </div>
            <div className="text-center bg-green-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-green-600">{driver.completion_rate || 100}%</p>
              <p className="text-xs text-gray-600">Éxito</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'info'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              📋 Información
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'reviews'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              ⭐ Reseñas
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'stats'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              📊 Estadísticas
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Info Tab */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* Vehicle Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  🚗 Información del Vehículo
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Tipo</p>
                    <p className="font-semibold text-gray-900 capitalize">
                      {driver.vehicle_type}
                    </p>
                  </div>
                  {driver.vehicle_plate && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Placa</p>
                      <p className="font-semibold text-gray-900">
                        {driver.vehicle_plate}
                      </p>
                    </div>
                  )}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Capacidad</p>
                    <p className="font-semibold text-gray-900">
                      {driver.vehicle_capacity} pasajeros
                    </p>
                  </div>
                  {driver.vehicle_model && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Modelo</p>
                      <p className="font-semibold text-gray-900">
                        {driver.vehicle_model}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📞 Contacto
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {driver.email}
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {driver.phone}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && <ReviewList driverId={id} />}

          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                <h4 className="text-lg font-semibold mb-4">Estadísticas de Viajes</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total de viajes:</span>
                    <span className="font-bold">{driver.total_trips}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completados:</span>
                    <span className="font-bold">{driver.completed_trips}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cancelados:</span>
                    <span className="font-bold">{driver.cancelled_trips || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tasa de éxito:</span>
                    <span className="font-bold">{driver.completion_rate}%</span>
                  </div>
                </div>
              </div>

              {driver.carbon_saved_kg > 0 && (
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
                  <h4 className="text-lg font-semibold mb-4">🌱 Impacto Ambiental</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>CO₂ ahorrado:</span>
                      <span className="font-bold">{driver.carbon_saved_kg.toFixed(1)} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Distancia total:</span>
                      <span className="font-bold">{driver.total_distance_km || 0} km</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverProfile;
