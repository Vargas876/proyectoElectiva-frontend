// src/components/driver/DriverList.jsx
import React, { useEffect, useState } from 'react';
import { driverApi } from '../../api/driverApi';
import ErrorMessage from '../common/ErrorMessage';
import Loader from '../common/Loader';
import DriverCard from './DriverCard';

const DriverList = ({ filter = {} }) => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await driverApi.getAll();
      setDrivers(response.data);
    } catch (error) {
      setError(error.message || 'Error al cargar conductores');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDrivers = drivers.filter((driver) => {
    // Search filter
    const matchesSearch = driver.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus =
      statusFilter === 'all' || driver.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <Loader size="lg" text="Cargando conductores..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchDrivers} />;
  }

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar conductor por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todos los estados</option>
          <option value="available">Disponibles</option>
          <option value="busy">Ocupados</option>
          <option value="offline">Desconectados</option>
        </select>
      </div>

      {/* Results Count */}
      <p className="text-gray-600 mb-4">
        Mostrando {filteredDrivers.length} de {drivers.length} conductores
      </p>

      {/* Driver Grid */}
      {filteredDrivers.length === 0 ? (
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No se encontraron conductores
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Intenta ajustar los filtros de búsqueda
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrivers.map((driver) => (
            <DriverCard key={driver._id} driver={driver} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DriverList;
