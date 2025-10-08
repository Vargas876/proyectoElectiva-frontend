import { useEffect, useState } from 'react';
import { tripApi } from '../api/tripApi';
import { useAuth } from '../context/AuthContext';

const Statistics = () => {
  const { driver } = useAuth();
  const [stats, setStats] = useState(null);
  const [globalStats, setGlobalStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    setLoading(true);
    try {
      // Estadísticas del conductor
      const driverStatsResponse = await tripApi.getStatistics(driver.id);
      setStats(driverStatsResponse.data);

      // Estadísticas globales
      const globalStatsResponse = await tripApi.getStatistics();
      setGlobalStats(globalStatsResponse.data);
    } catch (error) {
      console.error('Error loading statistics:', error);
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
            📊 Estadísticas Detalladas
          </h1>
          <p className="text-gray-600">
            Análisis completo de tu desempeño
          </p>
        </div>

        {/* Personal Stats */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Tus Estadísticas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <h3 className="text-blue-100 text-sm mb-2">Total de Viajes</h3>
              <p className="text-4xl font-bold">{stats?.total_trips || 0}</p>
              <p className="text-blue-100 text-sm mt-2">viajes registrados</p>
            </div>

            <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
              <h3 className="text-green-100 text-sm mb-2">Completados</h3>
              <p className="text-4xl font-bold">{stats?.completed || 0}</p>
              <p className="text-green-100 text-sm mt-2">viajes finalizados</p>
            </div>

            <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <h3 className="text-purple-100 text-sm mb-2">Tasa de Éxito</h3>
              <p className="text-4xl font-bold">{stats?.completion_rate || '0%'}</p>
              <p className="text-purple-100 text-sm mt-2">de completitud</p>
            </div>

            <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
              <h3 className="text-yellow-100 text-sm mb-2">Ingresos Totales</h3>
              <p className="text-3xl font-bold">${(stats?.total_revenue || 0).toLocaleString()}</p>
              <p className="text-yellow-100 text-sm mt-2">generados</p>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-semibold text-gray-700 mb-4">Desglose por Estado</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">📅</span>
                    <span className="font-medium text-gray-700">Programados</span>
                  </div>
                  <span className="badge badge-blue">{stats?.scheduled || 0}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🚗</span>
                    <span className="font-medium text-gray-700">En Progreso</span>
                  </div>
                  <span className="badge badge-yellow">{stats?.in_progress || 0}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">✅</span>
                    <span className="font-medium text-gray-700">Completados</span>
                  </div>
                  <span className="badge badge-green">{stats?.completed || 0}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">❌</span>
                    <span className="font-medium text-gray-700">Cancelados</span>
                  </div>
                  <span className="badge badge-red">{stats?.cancelled || 0}</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="font-semibold text-gray-700 mb-4">Rendimiento</h3>
              <div className="space-y-4">
                {/* Progress Bar - Completion Rate */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Tasa de Completitud</span>
                    <span className="text-sm font-bold text-green-600">{stats?.completion_rate || '0%'}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: stats?.completion_rate || '0%' }}
                    ></div>
                  </div>
                </div>

                {/* Average Revenue per Trip */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Ingreso Promedio por Viaje</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${stats?.completed > 0 
                      ? Math.round(stats.total_revenue / stats.completed).toLocaleString() 
                      : 0}
                  </p>
                </div>

                {/* Driver Info */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Tu Rating Actual</p>
                  <div className="flex items-center">
                    <span className="text-3xl text-yellow-500 mr-2">⭐</span>
                    <span className="text-2xl font-bold text-yellow-600">{driver?.rating || 5.0}</span>
                    <span className="text-gray-500 ml-2">/ 5.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Stats */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Estadísticas Globales del Sistema
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
              <h3 className="text-indigo-100 text-sm mb-2">Total Sistema</h3>
              <p className="text-4xl font-bold">{globalStats?.total_trips || 0}</p>
              <p className="text-indigo-100 text-sm mt-2">viajes en total</p>
            </div>

            <div className="card bg-gradient-to-br from-teal-500 to-teal-600 text-white">
              <h3 className="text-teal-100 text-sm mb-2">Tasa Global</h3>
              <p className="text-4xl font-bold">{globalStats?.completion_rate || '0%'}</p>
              <p className="text-teal-100 text-sm mt-2">de completitud</p>
            </div>

            <div className="card bg-gradient-to-br from-pink-500 to-pink-600 text-white">
              <h3 className="text-pink-100 text-sm mb-2">Ingresos Sistema</h3>
              <p className="text-3xl font-bold">${(globalStats?.total_revenue || 0).toLocaleString()}</p>
              <p className="text-pink-100 text-sm mt-2">generados en total</p>
            </div>
          </div>
        </div>

        {/* Comparison */}
        {stats && globalStats && (
          <div className="mt-8 card bg-gradient-to-br from-gray-50 to-gray-100">
            <h3 className="font-semibold text-gray-700 mb-4">📈 Tu Posición</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Contribución al Sistema</p>
                <p className="text-2xl font-bold text-blue-600">
                  {globalStats.total_trips > 0 
                    ? ((stats.total_trips / globalStats.total_trips) * 100).toFixed(1) 
                    : 0}%
                </p>
                <p className="text-sm text-gray-500">de todos los viajes</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Comparación de Rating</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {driver?.rating >= 4.5 ? '🏆 Excelente' : 
                   driver?.rating >= 4.0 ? '👍 Muy Bueno' : 
                   driver?.rating >= 3.5 ? '👌 Bueno' : '📈 En Mejora'}
                </p>
                <p className="text-sm text-gray-500">desempeño general</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Statistics;