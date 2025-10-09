import React, { useState } from 'react';
import { driverApi } from '../../api/driverApi';

const DriverForm = ({ driver = null, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: driver?.name || '',
    email: driver?.email || '',
    phone: driver?.phone || '',
    license_number: driver?.license_number || '',
    vehicle_type: driver?.vehicle_type || 'sedan',
    vehicle_plate: driver?.vehicle_plate || '',
    vehicle_capacity: driver?.vehicle_capacity || 4,
    vehicle_model: driver?.vehicle_model || '',
    vehicle_year: driver?.vehicle_year || new Date().getFullYear(),
    vehicle_color: driver?.vehicle_color || '',
    bio: driver?.bio || ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const vehicleTypes = [
    { value: 'sedan', label: 'Sedán' },
    { value: 'suv', label: 'SUV' },
    { value: 'van', label: 'Van' },
    { value: 'minibus', label: 'Minibús' },
    { value: 'hatchback', label: 'Hatchback' },
    { value: 'coupe', label: 'Coupé' }
  ];

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
      if (driver) {
        await driverApi.update(driver._id, formData);
        alert('✅ Conductor actualizado exitosamente');
      } else {
        await driverApi.create(formData);
        alert('✅ Conductor creado exitosamente');
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setError(error.message || 'Error al guardar el conductor');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {driver ? 'Editar Conductor' : 'Nuevo Conductor'}
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Personal Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre Completo *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            minLength={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Teléfono *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de Licencia *
          </label>
          <input
            type="text"
            name="license_number"
            value={formData.license_number}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Vehicle Info */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Información del Vehículo
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Vehículo *
            </label>
            <select
              name="vehicle_type"
              value={formData.vehicle_type}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {vehicleTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Placa
            </label>
            <input
              type="text"
              name="vehicle_plate"
              value={formData.vehicle_plate}
              onChange={handleChange}
              maxLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Capacidad (pasajeros) *
            </label>
            <input
              type="number"
              name="vehicle_capacity"
              value={formData.vehicle_capacity}
              onChange={handleChange}
              required
              min={1}
              max={20}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Modelo
            </label>
            <input
              type="text"
              name="vehicle_model"
              value={formData.vehicle_model}
              onChange={handleChange}
              placeholder="Ej: Toyota Corolla"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Año
            </label>
            <input
              type="number"
              name="vehicle_year"
              value={formData.vehicle_year}
              onChange={handleChange}
              min={1990}
              max={new Date().getFullYear() + 1}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <input
              type="text"
              name="vehicle_color"
              value={formData.vehicle_color}
              onChange={handleChange}
              placeholder="Ej: Blanco"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Biografía (opcional)
        </label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={3}
          maxLength={500}
          placeholder="Cuéntanos sobre ti..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-sm text-gray-500 mt-1">
          {formData.bio.length}/500 caracteres
        </p>
      </div>

      {/* Buttons */}
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
          ) : driver ? (
            'Actualizar Conductor'
          ) : (
            'Crear Conductor'
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

export default DriverForm;
