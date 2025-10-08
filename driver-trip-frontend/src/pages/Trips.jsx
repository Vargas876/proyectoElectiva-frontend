import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { tripApi } from '../api/tripApi';
import { STATUS_COLORS, STATUS_LABELS } from '../utils/constants';

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadTrips();
  }, [filter]);

  const loadTrips = async () => {
    setLoading(true);
    try {
      const filters = filter !== 'all' ? { status: filter } : {};
      const response = await tripApi.getAll(filters);
      setTrips(response.data);
    } catch (error) {
      console.error('Error loading trips:', error);
      alert('Error al cargar los viajes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de cancelar este viaje?')) return;

    try {
      await tripApi.delete(id);
      alert('Viaje cancelado exitosamente');
      loadTrips();
    } catch (error) {
      alert('Error al cancelar el viaje');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando viajes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Viajes Disponibles
            </h1>
            <p className="text-gray-600">
              {trips.length} viaje{trips.length !== 1 ? 's' : ''} encontrado{trips.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link to="/create-trip" className="btn btn-primary">
            + Crear Viaje
          </Link>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter('scheduled')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === 'scheduled' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Programados
            </button>
            <button
              onClick={() => setFilter('in_progress')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === 'in_progress' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              En Progreso
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === 'completed' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Completados
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === 'cancelled' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Cancelados
            </button>
          </div>
        </div>

        {/* Trips Grid */}
        {trips.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">🚗</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No hay viajes disponibles
            </h3>
            <p className="text-gray-500 mb-4">
              {filter !== 'all' 
                ? `No hay viajes con estado "${STATUS_LABELS[filter]}"`
                : 'Sé el primero en crear un viaje'
              }
            </p>
            {filter === 'all' && (
              <Link to="/create-trip" className="btn btn-primary">
                Crear Primer Viaje
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <div key={trip._id} className="card hover:shadow-lg transition">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {trip.origin} → {trip.destination}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Conductor: {trip.driver_id?.name || 'N/A'}
                    </p>
                  </div>
                  <span className={`badge ${STATUS_COLORS[trip.status]}`}>
                    {STATUS_LABELS[trip.status]}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-700">
                    <span className="mr-2">📅</span>
                    <span className="text-sm">{formatDate(trip.departure_time)}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <span className="mr-2">💰</span>
                    <span className="text-sm font-semibold">
                      ${trip.price.toLocaleString('es-CO')}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <span className="mr-2">👥</span>
                    <span className="text-sm">
                      {trip.available_seats} asientos disponibles
                    </span>
                  </div>

                  {trip.distance_km && (
                    <div className="flex items-center text-gray-700">
                      <span className="mr-2">📍</span>
                      <span className="text-sm">{trip.distance_km} km</span>
                    </div>
                  )}

                  {trip.duration_minutes && (
                    <div className="flex items-center text-gray-700">
                      <span className="mr-2">⏱️</span>
                      <span className="text-sm">{trip.duration_minutes} min</span>
                    </div>
                  )}
                </div>

                {/* Passengers */}
                {trip.passengers && trip.passengers.length > 0 && (
                  <div className="mb-4 pb-4 border-t pt-4">
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">
                      Pasajeros ({trip.passengers.length}):
                    </h4>
                    <div className="space-y-1">
                      {trip.passengers.map((passenger, index) => (
                        <div key={index} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          👤 {passenger.name} - {passenger.seats_reserved} asiento{passenger.seats_reserved > 1 ? 's' : ''}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    to={`/trips/${trip._id}`}
                    className="btn btn-primary flex-1 text-center"
                  >
                    Ver Detalles
                  </Link>
                  
                  {trip.status === 'scheduled' && (
                    <button
                      onClick={() => handleDelete(trip._id)}
                      className="btn btn-danger"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Trips;