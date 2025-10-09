import { DollarSign, MapPin, Search, Star } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { driverAPI } from '../../services/api';
import Navbar from '../shared/Navbar';

const DriverDashboard = () => {
  const navigate = useNavigate();
  const [availableRequests, setAvailableRequests] = useState([]);
  const [myOffers, setMyOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available'); // 'available' o 'myOffers'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [requestsRes, offersRes] = await Promise.all([
        driverAPI.getAvailableRequests(),
        driverAPI.getMyOffers()
      ]);
      
      setAvailableRequests(requestsRes.data.data);
      setMyOffers(offersRes.data.data);
    } catch (error) {
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleMakeOffer = (requestId) => {
    navigate(`/driver/make-offer/${requestId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Panel del Conductor</h1>
          <p className="text-gray-600 mt-1">Encuentra viajes y gestiona tus ofertas</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'available'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Viajes Disponibles ({availableRequests.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('myOffers')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'myOffers'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Mis Ofertas ({myOffers.length})
            </div>
          </button>
        </div>

        {/* Contenido según Tab Activo */}
        {activeTab === 'available' ? (
          // Viajes Disponibles
          <div>
            {availableRequests.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No hay solicitudes disponibles
                </h3>
                <p className="text-gray-600">
                  Vuelve pronto, los pasajeros publican viajes constantemente
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {availableRequests.map((request) => (
                  <div
                    key={request._id}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* Info del Pasajero */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                            {request.passenger_id?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800">
                              {request.passenger_id?.name}
                            </h4>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span>{request.passenger_id?.rating?.toFixed(1)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Ruta */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <div className="flex items-start gap-3 mb-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full mt-1"></div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-600">Origen</p>
                              <p className="font-semibold text-gray-800">
                                {request.origin.address}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-3 h-3 bg-red-500 rounded-full mt-1"></div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-600">Destino</p>
                              <p className="font-semibold text-gray-800">
                                {request.destination.address}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Detalles */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Oferta del pasajero</p>
                            <p className="text-2xl font-bold text-blue-600">
                              ${request.passenger_offer_price.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Asientos</p>
                            <p className="font-semibold text-gray-800">
                              {request.seats_needed}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Fecha</p>
                            <p className="font-semibold text-gray-800">
                              {new Date(request.departure_time).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Hora</p>
                            <p className="font-semibold text-gray-800">
                              {new Date(request.departure_time).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Botón de Acción */}
                      <div className="ml-6">
                        <button
                          onClick={() => handleMakeOffer(request._id)}
                          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                          <DollarSign className="w-5 h-5" />
                          Hacer Oferta
                        </button>
                        {request.driver_offers?.length > 0 && (
                          <p className="text-sm text-gray-500 mt-2 text-center">
                            {request.driver_offers.length} ofertas
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Mis Ofertas
          <div>
            {myOffers.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No has hecho ofertas aún
                </h3>
                <p className="text-gray-600">
                  Explora los viajes disponibles y haz tu primera oferta
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {myOffers.map((offer) => (
                  <div
                    key={offer._id}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* Info de la Oferta */}
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                            {offer.passenger_id?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800">
                              Pasajero: {offer.passenger_id?.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {new Date(offer.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* Ruta */}
                        <div className="mb-4">
                          <div className="flex items-center gap-2 text-sm mb-1">
                            <MapPin className="w-4 h-4 text-green-600" />
                            <span className="text-gray-800">{offer.origin?.address}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-red-600" />
                            <span className="text-gray-800">{offer.destination?.address}</span>
                          </div>
                        </div>

                        {/* Precios */}
                        <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Oferta del pasajero</p>
                            <p className="text-xl font-bold text-gray-700">
                              ${offer.passenger_offer_price?.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Tu oferta</p>
                            <p className="text-2xl font-bold text-blue-600">
                              ${offer.my_offer_price?.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* Mensaje */}
                        {offer.my_offer_message && (
                          <div className="mt-4 bg-blue-50 rounded-lg p-3">
                            <p className="text-sm text-gray-600 mb-1">Tu mensaje:</p>
                            <p className="text-gray-800">{offer.my_offer_message}</p>
                          </div>
                        )}
                      </div>

                      {/* Estado */}
                      <div className="ml-6 text-right">
                        <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                          offer.offer_status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : offer.offer_status === 'accepted'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {offer.offer_status === 'pending' ? 'Pendiente' :
                           offer.offer_status === 'accepted' ? '✓ Aceptada' : 'Rechazada'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;