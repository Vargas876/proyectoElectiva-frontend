import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { tripApi } from '../api/tripApi';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { driver } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, [driver]);

  const loadStatistics = async () => {
    try {
      const response = await tripApi.getStatistics(driver.id);
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Bienvenido, {driver?.name}! 👋
          </h1>
          <p className="text-gray-600">
            Este es tu panel de control
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">Rating</p>
                <p className="text-3xl font-bold">⭐ {driver?.rating || 5.0}</p>
              </div>
              <div className="text-5xl opacity-20">🌟</div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm mb-1">Total Viajes</p>
                <p className="text-3xl font-bold">{stats?.total_trips || 0}</p>
              </div>
              <div className="text-5xl opacity-20">🚗</div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm mb-1">Completados</p>
                <p className="text-3xl font-bold">{stats?.completed || 0}</p>
              </div>
              <div className="text-5xl opacity-20">✅</div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm mb-1">Ingresos</p>
                <p className="text-2xl font-bold">${(stats?.total_revenue || 0).toLocaleString()}</p>
              </div>
              <div className="text-5xl opacity-20">💰</div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <h3 className="font-semibold text-gray-700 mb-3">Viajes por Estado</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Programados</span>
                <span className="badge badge-blue">{stats?.scheduled || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">En Progreso</span>
                <span className="badge badge-yellow">{stats?.in_progress || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Cancelados</span>
                <span className="badge badge-red">{stats?.cancelled || 0}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-700 mb-3">Tasa de Completitud</h3>
            <div className="text-center py-4">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {stats?.completion_rate || '0%'}
              </div>
              <p className="text-sm text-gray-500">
                De tus viajes totales
              </p>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-700 mb-3">Tu Estado</h3>
            <div className="text-center py-4">
              <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                driver?.status === 'available' ? 'bg-green-100 text-green-800' :
                driver?.status === 'busy' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {driver?.status === 'available' ? '🟢 Disponible' :
                 driver?.status === 'busy' ? '🟡 Ocupado' :
                 '⚫ Offline'}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {driver?.total_trips || 0} viajes realizados
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="font-semibold text-gray-700 mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/create-trip" className="btn btn-primary text-center">
              🚗 Crear Nuevo Viaje
            </Link>
            <Link to="/trips" className="btn btn-secondary text-center">
              📋 Ver Mis Viajes
            </Link>
            <Link to="/statistics" className="btn btn-secondary text-center">
              📊 Ver Estadísticas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;