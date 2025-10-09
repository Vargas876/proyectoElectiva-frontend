import React, { useEffect, useState } from 'react';
import { recurringTripApi } from '../api/recurringTripApi';
import Navbar from '../components/common/Navbar';
import { useAuth } from '../context/AuthContext';

const RecurringTrips = () => {
  const { user } = useAuth();
  const [recurringTrips, setRecurringTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    days_of_week: [],
    departure_time: '',
    price: '',
    available_seats: 4
  });

  const daysOfWeek = [
    { value: 0, label: 'Dom' },
    { value: 1, label: 'Lun' },
    { value: 2, label: 'Mar' },
    { value: 3, label: 'Mié' },
    { value: 4, label: 'Jue' },
    { value: 5, label: 'Vie' },
    { value: 6, label: 'Sáb' }
  ];

  useEffect(() => {
    fetchRecurringTrips();
  }, []);

  const fetchRecurringTrips = async () => {
    try {
      setLoading(true);
      const response = await recurringTripApi.getAll();
      setRecurringTrips(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await recurringTripApi.create(formData);
      alert('✅ Viaje recurrente creado exitosamente');
      setShowForm(false);
      setFormData({
        origin: '',
        destination: '',
        days_of_week: [],
        departure_time: '',
        price: '',
        available_seats: 4
      });
      fetchRecurringTrips();
    } catch (error) {
      alert('❌ Error: ' + error.message);
    }
  };

  const handleToggleDay = (day) => {
    setFormData(prev => ({
      ...prev,
      days_of_week: prev.days_of_week.includes(day)
        ? prev.days_of_week.filter(d => d !== day)
        : [...prev.days_of_week, day]
    }));
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este viaje recurrente?')) return;
    
    try {
      await recurringTripApi.delete(id);
      alert('✅ Viaje eliminado');
      fetchRecurringTrips();
    } catch (error) {
      alert('❌ Error: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🔄 Viajes Recurrentes</h1>
            <p className="text-gray-600 mt-1">
              Programa viajes que se repiten semanalmente
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {showForm ? 'Cancelar' : '+ Nuevo Viaje Recurrente'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Crear Viaje Recurrente
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Origen
                  </label>
                  <input
                    type="text"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destino
                  </label>
                  <input
                    type="text"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Días de la Semana
                </label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => handleToggleDay(day.value)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        formData.days_of_week.includes(day.value)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora de Salida
                  </label>
                  <input
                    type="time"
                    value={formData.departure_time}
                    onChange={(e) => setFormData({ ...formData, departure_time: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Asientos Disponibles
                  </label>
                  <input
                    type="number"
                    value={formData.available_seats}
                    onChange={(e) => setFormData({ ...formData, available_seats: e.target.value })}
                    required
                    min="1"
                    max="8"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Crear Viaje Recurrente
              </button>
            </form>
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : recurringTrips.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600">No tienes viajes recurrentes configurados</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {recurringTrips.map((trip) => (
              <div key={trip._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-4">
                      <h3 className="text-xl font-bold text-gray-900">
                        {trip.origin} → {trip.destination}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        trip.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {trip.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Hora</p>
                        <p className="font-semibold text-gray-900">⏰ {trip.departure_time}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Precio</p>
                        <p className="font-semibold text-gray-900">💰 ${trip.price}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Asientos</p>
                        <p className="font-semibold text-gray-900">🪑 {trip.available_seats}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Días</p>
                        <div className="flex space-x-1 mt-1">
                          {trip.days_of_week.map((day) => (
                            <span key={day} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                              {daysOfWeek[day].label}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(trip._id)}
                    className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecurringTrips;
