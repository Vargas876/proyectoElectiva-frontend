import React, { useEffect, useState } from 'react';
import { rewardApi } from '../../api/rewardApi';
import BadgeDisplay from './BadgeDisplay';

const RewardsCard = () => {
  const [rewards, setRewards] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      setLoading(true);
      const response = await rewardApi.getRewards();
      setRewards(response.data);
    } catch (error) {
      setError(error.message || 'Error al cargar recompensas');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
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

  const pointsToNextLevel = (rewards?.level || 1) * 100;
  const progressPercentage = ((rewards?.points || 0) / pointsToNextLevel) * 100;

  return (
    <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-lg shadow-xl p-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">🎮 Gamificación</h2>
          <p className="text-sm opacity-90 mt-1">
            {rewards?.driver_id?.name || 'Usuario'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-4xl font-bold">Nivel {rewards?.level || 1}</p>
          <p className="text-sm opacity-90">Level</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Progreso al siguiente nivel</span>
          <span className="text-sm font-medium">
            {rewards?.points || 0} / {pointsToNextLevel} puntos
          </span>
        </div>
        <div className="w-full bg-white bg-opacity-30 rounded-full h-3">
          <div
            className="bg-white h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center backdrop-blur-sm">
          <p className="text-3xl font-bold">{rewards?.points || 0}</p>
          <p className="text-xs mt-1 opacity-90">Puntos</p>
        </div>
        <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center backdrop-blur-sm">
          <p className="text-3xl font-bold">{rewards?.badges?.length || 0}</p>
          <p className="text-xs mt-1 opacity-90">Badges</p>
        </div>
        <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center backdrop-blur-sm">
          <p className="text-3xl font-bold">{rewards?.streaks?.current_streak || 0}</p>
          <p className="text-xs mt-1 opacity-90">Racha</p>
        </div>
      </div>

      {/* Badges Preview */}
      {rewards?.badges && rewards.badges.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">🏆 Logros Desbloqueados</h3>
          <div className="grid grid-cols-4 gap-3">
            {rewards.badges.slice(0, 8).map((badge, index) => (
              <BadgeDisplay key={index} badge={badge} size="small" />
            ))}
          </div>
          {rewards.badges.length > 8 && (
            <button className="w-full mt-3 py-2 bg-white bg-opacity-20 rounded-lg text-sm font-medium hover:bg-opacity-30 transition-colors">
              Ver todos los badges ({rewards.badges.length})
            </button>
          )}
        </div>
      )}

      {/* Achievements */}
      {rewards?.achievements && rewards.achievements.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">📋 Desafíos Activos</h3>
          <div className="space-y-2">
            {rewards.achievements
              .filter(a => !a.completed)
              .slice(0, 3)
              .map((achievement, index) => (
                <div
                  key={index}
                  className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm"
                >
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium">{achievement.title}</p>
                    <p className="text-xs">
                      {achievement.progress}/{achievement.target}
                    </p>
                  </div>
                  <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
                    <div
                      className="bg-white h-2 rounded-full transition-all"
                      style={{
                        width: `${(achievement.progress / achievement.target) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardsCard;
