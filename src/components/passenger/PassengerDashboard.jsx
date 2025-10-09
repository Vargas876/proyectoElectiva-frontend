import { CheckCircle, Clock, DollarSign, Eye, MapPin, Plus, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { tripRequestAPI } from '../../services/api';
import Navbar from '../shared/Navbar';

const PassengerDashboard = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      const response = await tripRequestAPI.getMyRequests();
      setRequests(response.data.data);
    } catch (error) {
      toast.error('Error al cargar tus viajes');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'accepted':
        return <CheckCircle className="w-5 h-5" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const filteredRequests = requests.filter(req => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Mis Viajes</h1>
            <p className="text-gray-600 mt-1">Gestiona tus solicitudes de viaje</p>
          </div>
          <button
            onClick={() => navigate('/passenger/request-trip')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nuevo Viaje
          </button>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['all', 'pending', 'accepted', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {status === 'all' ? 'Todos' :
               status === 'pending' ? 'Pendientes' :
               status === 'accepted' ? 'Aceptados' :
               status === 'completed' ? 'Completados' : 'Cancelados'}
            </button>
          ))}
        </div>

        {/* Lista de Viajes */}
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No tienes viajes {filter !== 'all' ? filter : ''}
            </h3>
            <p className="text-gray-600 mb-6">
              Crea tu primera solicitud de viaje
            </p>
            <button
              onClick={() => navigate('/passenger/request-trip')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Solicitar Viaje
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredRequests.map((request) => (
              <div
                key={request._id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Rutas */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <p className="font-semibold text-gray-800">
                          {request.origin.address}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <p className="font-semibold text-gray-800">
                          {request.destination.address}
                        </p>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-semibold">
                          ${request.passenger_offer_price.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(request.departure_time).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {request.driver_offers?.length || 0} ofertas
                      </div>
                    </div>
                  </div>

                  {/* Estado y Acción */}
                  <div className="ml-6 text-right">
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4 ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)}
                      {request.status === 'pending' ? 'Esperando' :
                       request.status === 'accepted' ? 'Aceptado' :
                       request.status === 'completed' ? 'Completado' : 'Cancelado'}
                    </span>
                    
                    {request.status === 'pending' && request.driver_offers?.length > 0 && (
                      <button
                        onClick={() => navigate(`/passenger/offers/${request._id}`)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Ofertas
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PassengerDashboard;