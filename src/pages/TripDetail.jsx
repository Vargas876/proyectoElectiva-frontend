import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { tripApi } from '../api/tripApi';
import { useAuth } from '../context/AuthContext';
import { STATUS_COLORS, STATUS_LABELS } from '../utils/constants';

const TripDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { driver } = useAuth();
  
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPassengerForm, setShowPassengerForm] = useState(false);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [updating, setUpdating] = useState(false);
  
  const [passengerData, setPassengerData] = useState({
    name: '',
    phone: '',
    seats_reserved: 1
  });

  const [rating, setRating] = useState(5);

  useEffect(() => {
    loadTrip();
  }, [id]);

  const loadTrip = async () => {
    setLoading(true);
    try {
      const response = await tripApi.getById(id);
      setTrip(response.data);
    } catch (error) {
      console.error('Error loading trip:', error);
      alert('Error al cargar el viaje');
      navigate('/trips');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAddPassenger = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      await tripApi.addPassenger(id, passengerData);
      alert('¡Pasajero agregado exitosamente!');
      setShowPassengerForm(false);
      setPassengerData({ name: '', phone: '', seats_reserved: 1 });
      loadTrip();
    } catch (error) {
      alert(error.response?.data?.message || 'Error al agregar pasajero');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!window.confirm(`¿Cambiar estado a "${STATUS_LABELS[newStatus]}"?`)) return;

    setUpdating(true);
    try {
      await tripApi.update(id, { 
        status: newStatus,
        ...(newStatus === 'completed' && { arrival_time: new Date().toISOString() })
      });
      alert('Estado actualizado');
      loadTrip();
    } catch (error) {
      alert('Error al actualizar estado');
    } finally {
      setUpdating(false);
    }
  };

  const handleRateTrip = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      await tripApi.rateTrip(id, rating);
      alert('¡Viaje calificado exitosamente!');
      setShowRatingForm(false);
      loadTrip();
    } catch (error) {
      alert(error.response?.data?.message || 'Error al calificar');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de cancelar este viaje?')) return;

    try {
      await tripApi.delete(id);
      alert('Viaje cancelado');
      navigate('/trips');
    } catch (error) {
      alert('Error al cancelar viaje');
    }
  };

  const isOwner = trip && driver && trip.driver_id?._id === driver.id;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando detalles del viaje...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Viaje no encontrado</h2>
          <Link to="/trips" className="btn btn-primary">
            Volver a Viajes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Link to="/trips" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
          ← Volver a Viajes
        </Link>

        {/* Main Card */}
        <div className="card mb-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6 pb-6 border-b">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {trip.origin} → {trip.destination}
              </h1>
              <p className="text-gray-600">
                ID del Viaje: {trip._id}
              </p>
            </div>
            <span className={`badge ${STATUS_COLORS[trip.status]} text-lg px-4 py-2`}>
              {STATUS_LABELS[trip.status]}
            </span>
          </div>

          {/* Driver Info */}
          <div className="mb-6 pb-6 border-b">
            <h3 className="font-semibold text-gray-700 mb-3">👤 Conductor</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-lg">{trip.driver_id?.name || 'N/A'}</p>
                  <p className="text-gray-600">{trip.driver_id?.email || 'N/A'}</p>
                  <p className="text-gray-600">{trip.driver_id?.phone || 'N/A'}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Licencia: {trip.driver_id?.license_number || 'N/A'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center">
                    <span className="text-2xl text-yellow-500 mr-1">⭐</span>
                    <span className="text-2xl font-bold">{trip.driver_id?.rating || 5.0}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {trip.driver_id?.total_trips || 0} viajes
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Trip Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">📋 Detalles del Viaje</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="mr-3">📅</span>
                  <div>
                    <p className="font-medium text-gray-700">Salida</p>
                    <p className="text-gray-600">{formatDate(trip.departure_time)}</p>
                  </div>
                </div>

                {trip.arrival_time && (
                  <div className="flex items-start">
                    <span className="mr-3">🏁</span>
                    <div>
                      <p className="font-medium text-gray-700">Llegada</p>
                      <p className="text-gray-600">{formatDate(trip.arrival_time)}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start">
                  <span className="mr-3">💰</span>
                  <div>
                    <p className="font-medium text-gray-700">Precio</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${trip.price.toLocaleString('es-CO')}
                    </p>
                    <p className="text-sm text-gray-500">por persona</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="mr-3">👥</span>
                  <div>
                    <p className="font-medium text-gray-700">Asientos</p>
                    <p className="text-gray-600">
                      {trip.available_seats} disponibles de {trip.available_seats + (trip.passengers?.length || 0) * (trip.passengers?.[0]?.seats_reserved || 0)}
                    </p>
                  </div>
                </div>

                {trip.distance_km && (
                  <div className="flex items-start">
                    <span className="mr-3">📍</span>
                    <div>
                      <p className="font-medium text-gray-700">Distancia</p>
                      <p className="text-gray-600">{trip.distance_km} km</p>
                    </div>
                  </div>
                )}

                {trip.duration_minutes && (
                  <div className="flex items-start">
                    <span className="mr-3">⏱️</span>
                    <div>
                      <p className="font-medium text-gray-700">Duración Estimada</p>
                      <p className="text-gray-600">{trip.duration_minutes} minutos</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Passengers */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">
                👥 Pasajeros ({trip.passengers?.length || 0})
              </h3>
              {trip.passengers && trip.passengers.length > 0 ? (
                <div className="space-y-2">
                  {trip.passengers.map((passenger, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium text-gray-800">{passenger.name}</p>
                      <p className="text-sm text-gray-600">{passenger.phone}</p>
                      <p className="text-sm text-gray-500">
                        {passenger.seats_reserved} asiento{passenger.seats_reserved > 1 ? 's' : ''}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <p className="text-gray-500">Aún no hay pasajeros registrados</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {isOwner && (
            <div className="border-t pt-6">
                            <h3 className="font-semibold text-gray-700 mb-3">⚙️ Acciones del Conductor</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trip.status === 'scheduled' && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus('in_progress')}
                      className="btn btn-success"
                      disabled={updating}
                    >
                      🚀 Iniciar Viaje
                    </button>
                    <button
                      onClick={handleDelete}
                      className="btn btn-danger"
                      disabled={updating}
                    >
                      ❌ Cancelar Viaje
                    </button>
                  </>
                )}

                {trip.status === 'in_progress' && (
                  <button
                    onClick={() => handleUpdateStatus('completed')}
                    className="btn btn-success"
                    disabled={updating}
                  >
                    ✓ Completar Viaje
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Add Passenger Section */}
          {trip.status === 'scheduled' && trip.available_seats > 0 && !isOwner && (
            <div className="border-t pt-6">
              <button
                onClick={() => setShowPassengerForm(!showPassengerForm)}
                className="btn btn-primary w-full"
              >
                {showPassengerForm ? 'Ocultar Formulario' : '+ Reservar Asiento'}
              </button>

              {showPassengerForm && (
                <form onSubmit={handleAddPassenger} className="mt-4 bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Datos del Pasajero</h4>
                  
                  <div className="mb-3">
                    <label className="label">Nombre Completo</label>
                    <input
                      type="text"
                      className="input"
                      value={passengerData.name}
                      onChange={(e) => setPassengerData({...passengerData, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="label">Teléfono</label>
                    <input
                      type="tel"
                      className="input"
                      value={passengerData.phone}
                      onChange={(e) => setPassengerData({...passengerData, phone: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="label">Número de Asientos</label>
                    <input
                      type="number"
                      min="1"
                      max={trip.available_seats}
                      className="input"
                      value={passengerData.seats_reserved}
                      onChange={(e) => setPassengerData({...passengerData, seats_reserved: parseInt(e.target.value)})}
                      required
                    />
                  </div>

                  <div className="bg-white p-3 rounded mb-3">
                    <p className="text-sm text-gray-700">
                      <strong>Total a pagar:</strong> ${(trip.price * passengerData.seats_reserved).toLocaleString('es-CO')}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      type="submit" 
                      className="btn btn-success flex-1" 
                      disabled={updating}
                    >
                      {updating ? 'Reservando...' : 'Confirmar Reserva'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPassengerForm(false)}
                      className="btn btn-secondary"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Rating Section */}
          {trip.status === 'completed' && !isOwner && (
            <div className="border-t pt-6">
              <button
                onClick={() => setShowRatingForm(!showRatingForm)}
                className="btn btn-warning w-full"
              >
                {showRatingForm ? 'Ocultar' : '⭐ Calificar Viaje'}
              </button>

              {showRatingForm && (
                <form onSubmit={handleRateTrip} className="mt-4 bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Califica tu experiencia</h4>
                  
                  <div className="mb-4">
                    <div className="flex justify-center items-center gap-2 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`text-4xl transition ${
                            star <= rating ? 'text-yellow-500' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <p className="text-center text-gray-700 font-semibold">
                      {rating} de 5 estrellas
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      type="submit" 
                      className="btn btn-success flex-1" 
                      disabled={updating}
                    >
                      {updating ? 'Enviando...' : 'Enviar Calificación'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowRatingForm(false)}
                      className="btn btn-secondary"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card bg-blue-50 border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">ℹ️ Información</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Creado: {formatDate(trip.createdAt)}</li>
              <li>• Última actualización: {formatDate(trip.updatedAt)}</li>
              <li>• Estado: {STATUS_LABELS[trip.status]}</li>
            </ul>
          </div>

          {trip.status === 'scheduled' && (
            <div className="card bg-green-50 border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">💡 Recordatorio</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Llega 10 minutos antes de la salida</li>
                <li>• Verifica que tengas espacio suficiente</li>
                <li>• Mantén tu teléfono encendido</li>
                <li>• Respeta los acuerdos pactados</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripDetail;