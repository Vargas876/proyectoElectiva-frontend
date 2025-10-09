import React, { useEffect, useState } from 'react';
import { rewardApi } from '../../api/rewardApi';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('points'); // 'points' o 'level'

  useEffect(() => {
    fetchLeaderboard();
  }, [filter]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await rewardApi.getLeaderboard(10, filter);
      setLeaderboard(response.data);
    } catch (error) {
      setError(error.message || 'Error al cargar clasificación');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMedalEmoji = (position) => {
    if (position === 1) return '🥇';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return `#${position}`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 p-6">
        <h2 className="text-3xl font-bold text-white text-center mb-4">
          🏆 Tabla de Clasificación
        </h2>
        
        {/* Filter Tabs */}
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => setFilter('points')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              filter === 'points'
                ? 'bg-white text-orange-600 shadow-lg'
                : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
            }`}
          >
            Por Puntos
          </button>
          <button
            onClick={() => setFilter('level')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              filter === 'level'
                ? 'bg-white text-orange-600 shadow-lg'
                : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
            }`}
          >
            Por Nivel
          </button>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="divide-y divide-gray-200">
        {leaderboard.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No hay datos disponibles</p>
          </div>
        ) : (
          leaderboard.map((entry, index) => {
            const position = index + 1;
            const isTopThree = position <= 3;

            return (
              <div
                key={entry._id}
                className={`flex items-center p-6 hover:bg-gray-50 transition-colors ${
                  isTopThree ? 'bg-yellow-50' : ''
                }`}
              >
                {/* Position */}
                <div className="flex-shrink-0 w-16 text-center">
                  <span
                    className={`text-2xl font-bold ${
                      position === 1
                        ? 'text-yellow-500'
                        : position === 2
                        ? 'text-gray-400'
                        : position === 3
                        ? 'text-orange-600'
                        : 'text-gray-600'
                    }`}
                  >
                    {getMedalEmoji(position)}
                  </span>
                </div>

                {/* Avatar */}
                <div className="flex-shrink-0 mr-4">
                  {entry.driver_id?.profile_picture ? (
                    <img
                      src={entry.driver_id.profile_picture}
                      alt={entry.driver_id.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-gray-300"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                      {entry.driver_id?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {entry.driver_id?.name || 'Usuario'}
                  </h3>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                    <span className="flex items-center">
                      <svg
                        className="w-4 h-4 text-yellow-400 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {entry.driver_id?.rating?.toFixed(1) || '5.0'}
                    </span>
                    <span>
                      {entry.driver_id?.completed_trips || 0} viajes
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex-shrink-0 text-right ml-4">
                  <div className="flex items-center justify-end space-x-2 mb-1">
                    <span className="text-2xl font-bold text-gray-900">
                      Nivel {entry.level || 1}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {entry.points || 0} puntos
                  </p>
                  {entry.badges && entry.badges.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      🏆 {entry.badges.length} badges
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 p-4 text-center text-sm text-gray-600">
        <p>Actualizado en tiempo real • Compite con otros conductores</p>
      </div>
    </div>
  );
};

export default Leaderboard;
