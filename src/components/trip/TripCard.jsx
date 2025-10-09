import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import React from 'react';
import { Link } from 'react-router-dom';

const TripCard = ({ trip }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return '✅ Completado';
      case 'in_progress':
        return '🚗 En Progreso';
      case 'cancelled':
        return '❌ Cancelado';
      case 'scheduled':
        return '📅 Programado';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <div className="p-6">
        {/* Status Badge */}
        <div className="flex items-center justify-between mb-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
              trip.status
            )}`}
          >
            {getStatusText(trip.status)}
          </span>
          <span className="text-2xl font-bold text-blue-600">
            ${trip.price?.toLocaleString()}
          </span>
        </div>

        {/* Route */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <p className="text-lg font-semibold text-gray-900">{trip.origin}</p>
          </div>
          <div className="border-l-2 border-gray-300 ml-1.5 h-6"></div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <p className="text-lg font-semibold text-gray-900">
              {trip.destination}
            </p>
          </div>
        </div>

        {/* Trip Info */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-gray-600">📅 Fecha</p>
            <p className="font-semibold text-gray-900">
              {format(new Date(trip.departure_time), 'PPP', { locale: es })}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-gray-600">⏰ Hora</p>
            <p className="font-semibold text-gray-900">
              {format(new Date(trip.departure_time), 'p', { locale: es })}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-gray-600">🪑 Asientos</p>
            <p className="font-semibold text-gray-900">
              {trip.available_seats}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-gray-600">📏 Distancia</p>
            <p className="font-semibold text-gray-900">
              {trip.distance_km || 'N/A'} km
            </p>
          </div>
        </div>

        {/* Driver Info */}
        {trip.driver_id && (
          <div className="flex items-center space-x-3 pb-4 mb-4 border-b border-gray-200">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              {trip.driver_id.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {trip.driver_id.name}
              </p>
              <div className="flex items-center text-sm text-gray-600">
                <svg
                  className="w-4 h-4 text-yellow-400 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>{trip.driver_id.rating?.toFixed(1) || '5.0'}</span>
                <span className="ml-2">
                  ({trip.driver_id.total_trips || 0} viajes)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Passengers Count */}
        {trip.passengers && trip.passengers.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              👥 {trip.passengers.length}{' '}
              {trip.passengers.length === 1 ? 'pasajero' : 'pasajeros'}{' '}
              registrados
            </p>
          </div>
        )}

        {/* Action Button */}
        <Link
          to={`/trips/${trip._id}`}
          className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Ver Detalles
        </Link>
      </div>
    </div>
  );
};

export default TripCard;
