import React from 'react';
import BadgeDisplay from '../rewards/BadgeDisplay';

const DriverBadges = ({ driver }) => {
  // ✅ CAMBIAR DE driver.badges A driver.rewards.badges
  const badges = driver?.rewards?.badges || [];

  console.log('🎖️ Badges en componente:', badges);
  console.log('🎖️ Driver completo:', driver);

  if (badges.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <div className="text-6xl mb-4">🏅</div>
        <p className="text-lg text-gray-600 font-semibold mb-2">
          Este conductor aún no ha desbloqueado badges
        </p>
        <p className="text-sm text-gray-500">
          Completa más viajes para desbloquear logros
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        🏆 Badges Desbloqueados ({badges.length})
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {badges.map((badge, index) => (
          <BadgeDisplay key={index} badge={badge} size="medium" />
        ))}
      </div>

      {/* Resumen de badges por rareza */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">📊 Resumen de Badges</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-700">
              {badges.filter((b) => b.rarity === 'common').length}
            </p>
            <p className="text-sm text-gray-600">Comunes</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {badges.filter((b) => b.rarity === 'rare').length}
            </p>
            <p className="text-sm text-gray-600">Raros</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {badges.filter((b) => b.rarity === 'epic').length}
            </p>
            <p className="text-sm text-gray-600">Épicos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {badges.filter((b) => b.rarity === 'legendary').length}
            </p>
            <p className="text-sm text-gray-600">Legendarios</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverBadges;
