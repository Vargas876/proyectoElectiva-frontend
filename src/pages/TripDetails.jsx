// src/pages/TripDetails.jsx
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { tripApi } from '../api/tripApi';
import Navbar from '../components/common/Navbar';
import SOSButton from '../components/emergency/SOSButton';
import ReviewForm from '../components/review/ReviewForm';
import TripChat from '../components/trip/TripChat';
import { useAuth } from '../context/AuthContext';

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [activeTab, setActiveTab] = useState('details'); // 'details', 'chat', 'review'

  useEffect(() => {
    fetchTripDetails();
  }, [id]);

  const fetchTripDetails = async () => {
    try {
      setLoading(true);
      const response = await tripApi.getById(id);
      setTrip(response.data);
      
      // Mostrar formulario de review si el viaje está completado
      if (response.data.status === 'completed') {
        setShowReviewForm(true);
      }
    } catch (error) {
      setError(error.message || 'Error al cargar el viaje');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTrip = async () => {
    if (!confirm('¿Estás seguro de cancelar este viaje?')) return;

    try {
      await tripApi.update(id, { status: 'cancelled' });
      alert('Viaje cancelado');
      navigate('/trips');
    } catch (error) {
      alert('Error al cancelar el viaje: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error || 'Viaje no encontrado'}
          </div>
        </div>
      </div>
    );
  }

  const isDriver = user?.id === trip.driver_id?._id;
  const canChat = trip.status === 'in_progress' || trip.status === 'scheduled';
  const canReview = trip.status === 'completed' && !isDriver;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </button>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('details')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'details'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                📋 Detalles
              </button>
              {canChat && (
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === 'chat'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  💬 Chat
                </button>
              )}
              {canReview && (
                <button
                  onClick={() => setActiveTab('review')}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === 'review'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  ⭐ Calificar
                </button>
              )}
            </nav>
          </div>

          <div className="p-6">
            {/* Details Tab */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      trip.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : trip.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-800'
                        : trip.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {trip.status === 'completed'
                      ? '✅ Completado'
                      : trip.status === 'in_progress'
                      ? '🚗 En Progreso'
                      : trip.status === 'cancelled'
                      ? '❌ Cancelado'
                      : '📅 Programado'}
                  </span>

                  {trip.status === 'scheduled' && isDriver && (
                    <button
                      onClick={handleCancelTrip}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Cancelar Viaje
                    </button>
                  )}
                </div>

                {/* Route */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    🗺️ Ruta del Viaje
                  </h2>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 bg-blue-50 border-2 border-blue-500 rounded-lg p-4">
                      <p className="text-sm text-blue-600 font-medium">Origen</p>
                      <p className="text-lg font-bold text-gray-900">{trip.origin}</p>
                    </div>
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    <div className="flex-1 bg-green-50 border-2 border-green-500 rounded-lg p-4">
                      <p className="text-sm text-green-600 font-medium">Destino</p>
                      <p className="text-lg font-bold text-gray-900">{trip.destination}</p>
                    </div>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">💰 Precio</p>
                    <p className="text-xl font-bold text-gray-900">
                      ${trip.price?.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">🪑 Asientos</p>
                    <p className="text-xl font-bold text-gray-900">
                      {trip.available_seats}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">📏 Distancia</p>
                    <p className="text-xl font-bold text-gray-900">
                      {trip.distance_km || 'N/A'} km
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">⏱️ Duración</p>
                    <p className="text-xl font-bold text-gray-900">
                      {trip.duration_minutes || 'N/A'} min
                    </p>
                  </div>
                </div>

                {/* Schedule */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    📅 Horario
                  </h3>
                  <p className="text-gray-700">
                    <span className="font-medium">Salida:</span>{' '}
                    {format(new Date(trip.departure_time), "PPpp", { locale: es })}
                  </p>
                  {trip.arrival_time && (
                    <p className="text-gray-700 mt-1">
                      <span className="font-medium">Llegada:</span>{' '}
                      {format(new Date(trip.arrival_time), "PPpp", { locale: es })}
                    </p>
                  )}
                </div>

                {/* Driver Info */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    👤 Información del Conductor
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {trip.driver_id?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="text-xl font-bold text-gray-900">
                        {trip.driver_id?.name}
                      </p>
                      <p className="text-gray-600">{trip.driver_id?.email}</p>
                      <p className="text-gray-600">{trip.driver_id?.phone}</p>
                      <div className="flex items-center mt-2">
                        <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="ml-1 font-medium text-gray-900">
                          {trip.driver_id?.rating?.toFixed(1) || '5.0'}
                        </span>
                        <span className="ml-2 text-sm text-gray-600">
                          ({trip.driver_id?.total_trips || 0} viajes)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Passengers */}
                {trip.passengers && trip.passengers.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      👥 Pasajeros ({trip.passengers.length})
                    </h3>
                    <div className="space-y-2">
                      {trip.passengers.map((passenger, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                        >
                          <div>
                            <p className="font-medium text-gray-900">{passenger.name}</p>
                            <p className="text-sm text-gray-600">{passenger.phone}</p>
                          </div>
                          <span className="text-sm font-medium text-gray-600">
                            {passenger.seats_reserved} {passenger.seats_reserved === 1 ? 'asiento' : 'asientos'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Chat Tab */}
            {activeTab === 'chat' && canChat && (
              <div style={{ height: '600px' }}>
                <TripChat tripId={id} currentUser={user} />
              </div>
            )}

            {/* Review Tab */}
            {activeTab === 'review' && canReview && (
              <ReviewForm
                tripId={id}
                driverId={trip.driver_id._id}
                onReviewSubmitted={() => {
                  alert('✅ Gracias por tu calificación');
                  setActiveTab('details');
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* SOS Button (only if trip is in progress) */}
      {trip.status === 'in_progress' && (
        <SOSButton tripId={id} driverId={trip.driver_id._id} />
      )}
    </div>
  );
};

export default TripDetails;
