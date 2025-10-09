import React from 'react';
import BadgeDisplay from '../rewards/BadgeDisplay';

const DriverBadges = ({ driver }) => {
  if (!driver.badges || driver.badges.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Este conductor aún no ha desbloqueado badges</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        🏆 Badges Desbloqueados ({driver.badges.length})
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {driver.badges.map((badge, index) => (
          <BadgeDisplay key={index} badge={badge} size="medium" />
        ))}
      </div>
    </div>
  );
};

export default DriverBadges;
