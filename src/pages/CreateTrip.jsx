import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tripApi } from '../api/tripApi';
import { useAuth } from '../context/AuthContext';

const CreateTrip = () => {
  const { driver } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    departure_time: '',
    price: '',
    available_seats: 4,
    distance_km: '',
    duration_minutes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const tripData = {
        driver_id: driver.id,
        origin: formData.origin,
        destination: formData.destination,
        departure_time: formData.departure_time,
        price: parseFloat(formData.price),
        available_seats: parseInt(formData.available_seats),
      };

      // Agregar campos opcionales si tienen valor
      if (formData.distance_km) {
        tripData.distance_km = parseFloat(formData.distance_km);
      }
      if (formData.duration_minutes) {
        tripData.duration_minutes = parseInt(formData.duration_minutes);
      }

      await tripApi.create(tripData);
      alert('¡Viaje creado exitosamente!');
      navigate('/trips');
    } catch (error) {
      console.error('Error creating trip:', error);
      setError(error.response?.data?.message || 'Error al crear el viaje');
    } finally {
      setLoading(false);
    }
  };

  // Obtener fecha/hora mínima (ahora)
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Crear Nuevo Viaje
          </h1>
          <p className="text-gray-600">
            Completa la información de tu viaje
          </p>
        </div>

        {/* Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Origin & Destination */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Origen *</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Bogotá"
                  value={formData.origin}
                  onChange={(e) => setFormData({...formData, origin: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="label">Destino *</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Fusagasugá"
                  value={formData.destination}
                  onChange={(e) => setFormData({...formData, destination: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* Departure Time */}
            <div>
              <label className="label">Fecha y Hora de Salida *</label>
              <input
                type="datetime-local"
                className="input"
                value={formData.departure_time}
                onChange={(e) => setFormData({...formData, departure_time: e.target.value})}
                min={getMinDateTime()}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                La fecha debe ser futura
              </p>
            </div>

            {/* Price & Seats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Precio por Persona *</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                  <input
                    type="number"
                    className="input pl-8"
                    placeholder="25000"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label">Asientos Disponibles *</label>
                <input
                  type="number"
                  className="input"
                  value={formData.available_seats}
                  onChange={(e) => setFormData({...formData, available_seats: e.target.value})}
                  min="1"
                  max="8"
                  required
                />
              </div>
            </div>

            {/* Optional Fields */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-700 mb-4">
                Información Adicional (Opcional)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Distancia (km)</label>
                  <input
                    type="number"
                    className="input"
                    placeholder="65"
                    value={formData.distance_km}
                    onChange={(e) => setFormData({...formData, distance_km: e.target.value})}
                    min="0"
                  />
                </div>

                <div>
                  <label className="label">Duración (minutos)</label>
                  <input
                    type="number"
                    className="input"
                    placeholder="90"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({...formData, duration_minutes: e.target.value})}
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">📋 Resumen</h4>
              <div className="space-y-1 text-sm text-blue-800">
                <p>• Ruta: {formData.origin || '...'} → {formData.destination || '...'}</p>
                <p>• Precio: ${formData.price ? parseFloat(formData.price).toLocaleString() : '...'} por persona</p>
                <p>• Asientos: {formData.available_seats}</p>
                <p>• Ingreso potencial: ${formData.price && formData.available_seats ? 
                  (parseFloat(formData.price) * parseInt(formData.available_seats)).toLocaleString() : '...'}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                type="submit"
                className="btn btn-primary flex-1"
                disabled={loading}
              >
                {loading ? 'Creando...' : '✓ Crear Viaje'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/trips')}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>

        {/* Info Card */}
        <div className="card mt-6 bg-yellow-50 border border-yellow-200">
          <h4 className="font-semibold text-yellow-900 mb-2">💡 Consejos</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Programa tu viaje con anticipación para conseguir más pasajeros</li>
            <li>• Define un precio justo considerando gasolina, peajes y desgaste</li>
            <li>• Asegúrate de tener tu vehículo en buen estado</li>
            <li>• Sé puntual en la hora de salida</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateTrip;