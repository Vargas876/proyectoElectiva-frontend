import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('points');

  useEffect(() => {
    fetchLeaderboard();
  }, [sortBy]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Solicitando leaderboard...');
      
      const response = await axios.get(`/rewards/leaderboard?sortBy=${sortBy}&limit=10`);
      
      console.log('✅ Respuesta completa:', response);
      
      if (response.success) {
        console.log('✅ Leaderboard con', response.data.length, 'conductores');
        
        // ✅ TRANSFORMAR DATOS RAW A FORMATO ESPERADO
        const transformedData = response.data.map((item, index) => {
          // Si ya viene con rank, driver, rewards (formato correcto)
          if (item.rank && item.driver && item.rewards) {
            return item;
          }
          
          // Si viene con driver_id (formato raw), transformar
          const driver = item.driver_id || {};
          return {
            rank: index + 1,
            driver: {
              id: driver._id || driver.id,
              name: driver.name || 'Desconocido',
              email: driver.email || '',
              rating: driver.rating || 0,
              total_trips: driver.total_trips || 0,
              completed_trips: driver.completed_trips || 0
            },
            rewards: {
              points: item.points || 0,
              level: item.level || 1,
              badges: driver.badges || item.badges || [],
              achievements: item.achievements || []
            }
          };
        });
        
        console.log('✅ Datos transformados:', transformedData);
        setLeaderboard(transformedData);
      } else {
        setError('No se pudo cargar el leaderboard');
      }
    } catch (error) {
      console.error('❌ ERROR:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Cargando leaderboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 font-semibold mb-2">❌ Error al cargar</p>
        <p className="text-sm text-gray-600">{error}</p>
        <button
          onClick={fetchLeaderboard}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 rounded-2xl shadow-2xl p-6">
      {/* Header */}
      <div className="flex flex-col items-center mb-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">🏆</span>
          <h2 className="text-3xl font-bold text-white">Tabla de Clasificación</h2>
        </div>
        
        <div className="flex gap-2 bg-white/20 rounded-lg p-1">
          <button
            onClick={() => setSortBy('points')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              sortBy === 'points'
                ? 'bg-white text-orange-600 shadow-lg'
                : 'text-white hover:bg-white/10'
            }`}
          >
            Por Puntos
          </button>
          <button
            onClick={() => setSortBy('level')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              sortBy === 'level'
                ? 'bg-white text-orange-600 shadow-lg'
                : 'text-white hover:bg-white/10'
            }`}
          >
            Por Nivel
          </button>
        </div>
      </div>

      {leaderboard.length === 0 ? (
        <div className="text-center py-12 text-white">
          <p className="text-lg font-semibold">No hay datos en el leaderboard</p>
        </div>
      ) : (
        <div className="space-y-4">
          {leaderboard.map((entry, index) => {
            const driver = entry.driver || {};
            const rewards = entry.rewards || {};
            const rank = entry.rank || index + 1;
            
            return (
              <div
                key={driver.id || index}
                className={`bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 shadow-lg border-2 ${
                  rank <= 3 ? 'border-yellow-400' : 'border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  {/* Izquierda: Ranking + Avatar + Info */}
                  <div className="flex items-center gap-4 flex-1">
                    {/* Medalla/Ranking */}
                    <div className="flex items-center justify-center w-12 h-12">
                      {rank === 1 && <span className="text-4xl">🥇</span>}
                      {rank === 2 && <span className="text-4xl">🥈</span>}
                      {rank === 3 && <span className="text-4xl">🥉</span>}
                      {rank > 3 && (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-lg">
                          #{rank}
                        </div>
                      )}
                    </div>

                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                      {driver.name ? driver.name.charAt(0).toUpperCase() : '?'}
                    </div>

                    {/* Info del conductor */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800">
                        {driver.name || 'Desconocido'}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          ⭐ {(driver.rating || 0).toFixed(1)}
                        </span>
                        <span className="flex items-center gap-1">
                          🚗 {driver.total_trips || 0} viajes
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Derecha: Nivel, Puntos y Badges */}
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-800">
                      Nivel {rewards.level || 1}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      {rewards.points || 0} puntos
                    </div>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-xl">🏅</span>
                      <span className="text-sm text-gray-500 font-medium">
                        {rewards.badges?.length || 0} badges
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-6 text-center text-xs text-white/80">
        Actualizado en tiempo real • Compite con otros conductores
      </div>
    </div>
  );
};

export default Leaderboard;
