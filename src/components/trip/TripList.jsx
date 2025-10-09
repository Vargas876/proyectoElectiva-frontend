// src/components/trip/TripList.jsx
import React, { useEffect, useState } from 'react';
import { tripApi } from '../../api/tripApi';
import ErrorMessage from '../common/ErrorMessage';
import Loader from '../common/Loader';
import TripCard from './TripCard';

const TripList = ({ driverId = null }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchTrips();
  }, [driverId]);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (driverId) params.driver_id = driverId;
      
      const response = await tripApi.getAll(params);
      setTrips(response.data);
    } catch (error) {
      setError(error.message || 'Error al cargar viajes');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTrips = trips.filter((trip) => {
    if (statusFilter === 'all') return true;
    return trip.status === statusFilter;
  });

  if (loading) {
    return <Loader size="lg" text="Cargando viajes..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchTrips} />;
  }

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-gray-600">
            Mostrando {filteredTrips.length} de {trips.length} viajes
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todos los estados</option>
          <option value="scheduled">Programados</option>
          <option value="in_progress">En Progreso</option>
          <option value="completed">Completados</option>
          <option value="cancelled">Cancelados</option>
        </select>
      </div>

      {/* Trip Grid */}
      {filteredTrips.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No se encontraron viajes
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Intenta ajustar los filtros de búsqueda
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <TripCard key={trip._id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TripList;
