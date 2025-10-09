import { Calendar, DollarSign, MapPin, Send, Users } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { tripRequestAPI } from '../../services/api';
import MapComponent from '../shared/Map';

const RequestTrip = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    origin: null,
    destination: null,
    passenger_offer_price: '',
    seats_needed: 1,
    departure_time: ''
  });

  const handleOriginChange = (coords) => {
    setFormData(prev => ({
      ...prev,
      origin: {
        coordinates: coords,
        address: `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`
      }
    }));
  };

  const handleDestinationChange = (coords) => {
    setFormData(prev => ({
      ...prev,
      destination: {
        coordinates: coords,
        address: `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.origin || !formData.destination) {
      toast.error('Selecciona origen y destino en el mapa');
      return;
    }

    setLoading(true);

    try {
      const response = await tripRequestAPI.create(formData);
      toast.success('¡Solicitud creada! Los conductores verán tu oferta');
      navigate('/passenger/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al crear solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Mapa */}
            <div className="h-[600px] bg-gray-100">
              <MapComponent
                origin={formData.origin?.coordinates}
                destination={formData.destination?.coordinates}
                onOriginChange={handleOriginChange}
                onDestinationChange={handleDestinationChange}
              />
            </div>

            {/* Formulario */}
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Solicitar Viaje
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Origen */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-5 h-5 text-green-600" />
                    Origen
                  </label>
                  <input
                    type="text"
                    value={formData.origin?.address || 'Selecciona en el mapa'}
                    readOnly
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg"
                  />
                </div>

                {/* Destino */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-5 h-5 text-red-600" />
                    Destino
                  </label>
                  <input
                    type="text"
                    value={formData.destination?.address || 'Selecciona en el mapa'}
                    readOnly
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg"
                  />
                </div>

                {/* Precio Ofertado */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                    ¿Cuánto ofreces pagar?
                  </label>
                  <input
                    type="number"
                    value={formData.passenger_offer_price}
                    onChange={(e) => setFormData({ ...formData, passenger_offer_price: e.target.value })}
                    required
                    min="1000"
                    step="1000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="15000"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Los conductores podrán aceptar, rechazar o contraofertar
                  </p>
                </div>

                {/* Asientos */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    Asientos necesarios
                  </label>
                  <select
                    value={formData.seats_needed}
                    onChange={(e) => setFormData({ ...formData, seats_needed: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>1 asiento</option>
                    <option value={2}>2 asientos</option>
                    <option value={3}>3 asientos</option>
                    <option value={4}>4 asientos</option>
                  </select>
                </div>

                {/* Fecha y Hora */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-5 h-5 text-orange-600" />
                    ¿Cuándo necesitas viajar?
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.departure_time}
                    onChange={(e) => setFormData({ ...formData, departure_time: e.target.value })}
                    required
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Botón Enviar */}
                <button
                  type="submit"
                  disabled={loading || !formData.origin || !formData.destination}
                  className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  {loading ? 'Enviando...' : 'Solicitar Viaje'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestTrip;