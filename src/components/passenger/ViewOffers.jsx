import { Check, Clock, DollarSign, Mail, Phone, Star } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { tripRequestAPI } from '../../services/api';

const ViewOffers = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [tripRequest, setTripRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTripRequest();
  }, [requestId]);

  const fetchTripRequest = async () => {
    try {
      const response = await tripRequestAPI.getById(requestId);
      setTripRequest(response.data.data);
    } catch (error) {
      toast.error('Error al cargar ofertas');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOffer = async (offerId) => {
    if (!window.confirm('¿Aceptar esta oferta? No podrás cambiarla después.')) {
      return;
    }

    try {
      await tripRequestAPI.acceptOffer(requestId, offerId);
      toast.success('¡Oferta aceptada! El conductor ha sido notificado');
      navigate('/passenger/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al aceptar oferta');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!tripRequest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Solicitud no encontrada</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Información del Viaje */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Tu Solicitud de Viaje</h2>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">Origen</p>
              <p className="font-semibold">{tripRequest.origin.address}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Destino</p>
              <p className="font-semibold">{tripRequest.destination.address}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Tu oferta</p>
                <p className="font-bold text-lg">${tripRequest.passenger_offer_price.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Salida</p>
                <p className="font-semibold">{new Date(tripRequest.departure_time).toLocaleString()}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Estado</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                tripRequest.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                tripRequest.status === 'accepted' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {tripRequest.status === 'pending' ? 'Esperando ofertas' :
                 tripRequest.status === 'accepted' ? 'Aceptado' : 'Finalizado'}
              </span>
            </div>
          </div>
        </div>

        {/* Ofertas de Conductores */}
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Ofertas Recibidas ({tripRequest.driver_offers?.length || 0})
        </h3>

        {tripRequest.driver_offers?.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">
              Aún no has recibido ofertas. Los conductores verán tu solicitud pronto.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tripRequest.driver_offers.map((offer) => (
              <div
                key={offer._id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Info del Conductor */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {offer.driver_id?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-800">
                          {offer.driver_id?.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Star className="w-5 h-5 text-yellow-500 fill-current" />
                          <span className="font-semibold">{offer.driver_id?.rating?.toFixed(1)}</span>
                          <span className="text-gray-600 text-sm">
                            ({offer.driver_id?.total_trips || 0} viajes)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Precio Ofertado */}
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Precio propuesto</p>
                          <p className="text-3xl font-bold text-blue-600">
                            ${offer.offered_price.toLocaleString()}
                          </p>
                        </div>
                        {offer.offered_price !== tripRequest.passenger_offer_price && (
                          <div className={`text-right ${
                            offer.offered_price > tripRequest.passenger_offer_price 
                              ? 'text-red-600' 
                              : 'text-green-600'
                          }`}>
                            <p className="text-sm font-semibold">
                              {offer.offered_price > tripRequest.passenger_offer_price ? '+' : ''}
                              ${(offer.offered_price - tripRequest.passenger_offer_price).toLocaleString()}
                            </p>
                            <p className="text-xs">vs tu oferta</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Mensaje del Conductor */}
                    {offer.message && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <p className="text-sm text-gray-600 mb-1">Mensaje:</p>
                        <p className="text-gray-800">{offer.message}</p>
                      </div>
                    )}

                    {/* Contacto */}
                    <div className="flex gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {offer.driver_id?.phone}
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {offer.driver_id?.email}
                      </div>
                    </div>
                  </div>

                  {/* Botones de Acción */}
                  {tripRequest.status === 'pending' && offer.status === 'pending' && (
                    <div className="ml-6">
                      <button
                        onClick={() => handleAcceptOffer(offer._id)}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2 mb-2"
                      >
                        <Check className="w-5 h-5" />
                        Aceptar
                      </button>
                    </div>
                  )}

                  {offer.status === 'accepted' && (
                    <div className="ml-6">
                      <span className="bg-green-100 text-green-800 px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
                        <Check className="w-5 h-5" />
                        Aceptada
                      </span>
                    </div>
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

export default ViewOffers;