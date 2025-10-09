// src/components/driver/DriverCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const DriverCard = ({ driver }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'busy':
        return 'bg-yellow-100 text-yellow-800';
      case 'offline':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available':
        return 'Disponible';
      case 'busy':
        return 'Ocupado';
      case 'offline':
        return 'Desconectado';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            {/* Avatar */}
            {driver.profile_picture ? (
              <img
                src={driver.profile_picture}
                alt={driver.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {driver.name?.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Info */}
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {driver.name}
              </h3>
              <div className="flex items-center mt-1">
                <svg className="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-semibold text-gray-900">
                  {driver.rating?.toFixed(1) || '5.0'}
                </span>
                <span className="text-sm text-gray-600 ml-2">
                  ({driver.total_trips || 0} viajes)
                </span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(driver.status)}`}>
            {getStatusText(driver.status)}
          </span>
        </div>

        {/* Vehicle Info */}
        {driver.vehicle_type && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-600">Vehículo</p>
                <p className="font-semibold text-gray-900 capitalize">
                  {driver.vehicle_type}
                </p>
              </div>
              {driver.vehicle_plate && (
                <div>
                  <p className="text-gray-600">Placa</p>
                  <p className="font-semibold text-gray-900">
                    {driver.vehicle_plate}
                  </p>
                </div>
              )}
              <div>
                <p className="text-gray-600">Capacidad</p>
                <p className="font-semibold text-gray-900">
                  {driver.vehicle_capacity || 4} pasajeros
                </p>
              </div>
              {driver.vehicle_model && (
                <div>
                  <p className="text-gray-600">Modelo</p>
                  <p className="font-semibold text-gray-900">
                    {driver.vehicle_model}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {driver.completed_trips || 0}
            </p>
            <p className="text-xs text-gray-600">Completados</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {driver.completion_rate || 100}%
            </p>
            <p className="text-xs text-gray-600">Tasa éxito</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {driver.level || 1}
            </p>
            <p className="text-xs text-gray-600">Nivel</p>
          </div>
        </div>

        {/* Verification Badges */}
        {driver.verification && (
          <div className="flex flex-wrap gap-2 mb-4">
            {driver.verification.document_verified && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                ✓ ID Verificado
              </span>
            )}
            {driver.verification.license_verified && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                ✓ Licencia
              </span>
            )}
            {driver.is_trusted && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                ⭐ Confiable
              </span>
            )}
          </div>
        )}

        {/* Contact Info */}
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {driver.email}
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {driver.phone}
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={`/drivers/${driver._id}`}
          className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Ver Perfil Completo
        </Link>
      </div>
    </div>
  );
};

export default DriverCard;
