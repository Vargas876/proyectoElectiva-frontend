// src/components/trip/TripForm.jsx
import React, { useState } from 'react';
import { tripApi } from '../../api/tripApi';
import { useAuth } from '../../context/AuthContext';

const TripForm = ({ trip = null, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    driver_id: trip?.driver_id?._id || user?.id || '',
    origin: trip?.origin || '',
    destination: trip?.destination || '',
    departure_time: trip?.departure_time ? new Date(trip.departure_time).toISOString().slice(0, 16) : '',
    price: trip?.price || '',
    available_seats: trip?.available_seats || 4,
    distance_km: trip?.distance_km || '',
    duration_minutes: trip?.duration_minutes || ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (trip) {
        await tripApi.update(trip._id, formData);
        alert('✅ Viaje actualizado exitosamente');
      } else {
        await tripApi.create(formData);
        alert('✅ Viaje creado exitosamente');
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setError(error.message || 'Error al guardar el viaje');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {trip ? 'Editar Viaje' : 'Nuevo Viaje'}
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Origen *
          </label>
          <input
            type="text"
            name="origin"
            value={formData.origin}
            onChange={handleChange}
            required
            placeholder="Ciudad/Dirección de origen"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Destino *
          </label>
          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            required
            placeholder="Ciudad/Dirección de destino"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha y Hora de Salida *
          </label>
          <input
            type="datetime-local"
            name="departure_time"
            value={formData.departure_time}
            onChange={handleChange}
            required
            min={new Date().toISOString().slice(0, 16)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Precio *
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="1000"
            placeholder="Precio en COP"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Asientos Disponibles *
          </label>
          <input
            type="number"
            name="available_seats"
            value={formData.available_seats}
            onChange={handleChange}
            required
            min="1"
            max="8"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Distancia (km)
          </label>
          <input
            type="number"
            name="distance_km"
            value={formData.distance_km}
            onChange={handleChange}
            min="0"
            step="0.1"
            placeholder="Distancia aproximada"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duración (minutos)
          </label>
          <input
            type="number"
            name="duration_minutes"
            value={formData.duration_minutes}
            onChange={handleChange}
            min="0"
            placeholder="Duración estimada"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Guardando...
            </span>
          ) : trip ? (
            'Actualizar Viaje'
          ) : (
            'Crear Viaje'
          )}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default TripForm;
