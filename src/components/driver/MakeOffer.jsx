import { ArrowLeft, DollarSign, MapPin, MessageSquare, Send, Star } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { driverAPI, tripRequestAPI } from '../../services/api';
import MapComponent from '../shared/Map';

const MakeOffer = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [tripRequest, setTripRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    offered_price: '',
    message: ''
  });

  useEffect(() => {
    fetchTripRequest();
  }, [requestId]);

  const fetchTripRequest = async () => {
    try {
      const response = await tripRequestAPI.getById(requestId);
      setTripRequest(response.data.data);
      // Pre-llenar con el precio del pasajero
      setFormData(prev => ({
        ...prev,
        offered_price: response.data.data.passenger_offer_price
      }));
    } catch (error) {
      toast.error('Error al cargar la solicitud');
      navigate('/driver/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.offered_price || formData.offered_price <= 0) {
      toast.error('Ingresa un precio válido');
      return;
    }

    setSubmitting(true);

    try {
      await driverAPI.makeOffer(requestId, formData);
      toast.success('¡Oferta enviada! El pasajero será notificado');
      navigate('/driver/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al enviar oferta');
    } finally {
      setSubmitting(false);
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
    return null;
  }

  const priceDifference = formData.offered_price - tripRequest.passenger_offer_price;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Botón Volver */}
        <button
          onClick={() => navigate('/driver/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Mapa */}
            <div className="h-[600px] bg-gray-100">
              <MapComponent
                origin={tripRequest.origin.coordinates}
                destination={tripRequest.destination.coordinates}
                onOriginChange={() => {}}
                onDestinationChange={() => {}}
              />
            </div>

            {/* Formulario */}
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Hacer Oferta
              </h2>

              {/* Info del Pasajero */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {tripRequest.passenger_id?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {tripRequest.passenger_id?.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="font-semibold">
                        {tripRequest.passenger_id?.rating?.toFixed(1)}
                      </span>
                      <span className="text-gray-600 text-sm">
                        ({tripRequest.passenger_id?.total_trips || 0} viajes)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Origen</p>
                      <p className="font-semibold text-gray-800">
                        {tripRequest.origin.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Destino</p>
                      <p className="font-semibold text-gray-800">
                        {tripRequest.destination.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formulario de Oferta */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Precio del Pasajero */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Oferta del pasajero</p>
                  <p className="text-3xl font-bold text-blue-600">
                    ${tripRequest.passenger_offer_price.toLocaleString()}
                  </p>
                </div>

                {/* Tu Precio */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Tu oferta de precio
                  </label>
                  <input
                    type="number"
                    value={formData.offered_price}
                    onChange={(e) => setFormData({ ...formData, offered_price: e.target.value })}
                    required
                    min="1000"
                    step="1000"
                    className="w-full px-4 py-3 text-2xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="20000"
                  />
                  
                  {/* Indicador de Diferencia */}
                  {formData.offered_price && (
                    <div className={`mt-2 text-sm font-semibold ${
                      priceDifference > 0 ? 'text-green-600' : 
                      priceDifference < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {priceDifference > 0 && `+$${priceDifference.toLocaleString()} más que su oferta`}
                      {priceDifference < 0 && `$${Math.abs(priceDifference).toLocaleString()} menos que su oferta`}
                      {priceDifference === 0 && 'Mismo precio que su oferta'}
                    </div>
                  )}
                </div>

                {/* Mensaje Opcional */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                    Mensaje para el pasajero (opcional)
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Ej: Tengo un auto cómodo y amplio. Puedo recogerlo puntual..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Un mensaje personalizado aumenta tus posibilidades
                  </p>
                </div>

                {/* Botón Enviar */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  {submitting ? 'Enviando oferta...' : 'Enviar Oferta'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakeOffer;