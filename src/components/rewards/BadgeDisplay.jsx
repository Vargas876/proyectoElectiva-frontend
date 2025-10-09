// src/components/rewards/BadgeDisplay.jsx
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import React from 'react';

const BadgeDisplay = ({ badge, size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-16 h-16 text-2xl',
    medium: 'w-24 h-24 text-4xl',
    large: 'w-32 h-32 text-5xl'
  };

  const rarityColors = {
    common: 'from-gray-400 to-gray-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-orange-600'
  };

  const rarityLabels = {
    common: 'Común',
    rare: 'Raro',
    epic: 'Épico',
    legendary: 'Legendario'
  };

  return (
    <div className="flex flex-col items-center group">
      {/* Badge Circle */}
      <div
        className={`
          ${sizeClasses[size]} 
          rounded-full 
          bg-gradient-to-br ${rarityColors[badge.rarity || 'common']}
          flex items-center justify-center
          shadow-lg
          transform transition-transform duration-300
          group-hover:scale-110 group-hover:rotate-12
          cursor-pointer
          relative
        `}
        title={badge.description}
      >
        <span className="filter drop-shadow-lg">
          {badge.icon || '🏆'}
        </span>
        
        {/* Shine Effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transition-opacity"></div>
      </div>

      {/* Badge Info */}
      {size !== 'small' && (
        <div className="text-center mt-2">
          <p className="text-sm font-semibold text-gray-900">{badge.name}</p>
          {badge.rarity && (
            <p className={`text-xs font-medium ${
              badge.rarity === 'legendary' ? 'text-yellow-600' :
              badge.rarity === 'epic' ? 'text-purple-600' :
              badge.rarity === 'rare' ? 'text-blue-600' :
              'text-gray-600'
            }`}>
              {rarityLabels[badge.rarity]}
            </p>
          )}
          {badge.earned_at && (
            <p className="text-xs text-gray-500 mt-1">
              Obtenido {formatDistanceToNow(new Date(badge.earned_at), {
                addSuffix: true,
                locale: es
              })}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default BadgeDisplay;
