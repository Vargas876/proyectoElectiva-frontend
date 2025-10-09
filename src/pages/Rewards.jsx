import React from 'react';
import Navbar from '../components/common/Navbar';
import Leaderboard from '../components/rewards/Leaderboard';
import RewardsCard from '../components/rewards/RewardsCard';
import { useAuth } from '../context/AuthContext';

const Rewards = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🎮 Sistema de Recompensas
          </h1>
          <p className="text-gray-600">
            Completa viajes, gana puntos y desbloquea logros especiales
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Rewards */}
          <div>
            <RewardsCard />
            
            {/* How it Works */}
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                📚 ¿Cómo funciona?
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Completa Viajes</h4>
                    <p className="text-sm text-gray-600">
                      Gana 10 puntos por cada viaje completado exitosamente
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Recibe Buenas Calificaciones</h4>
                    <p className="text-sm text-gray-600">
                      Mantén un rating alto para obtener bonificaciones
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🏆</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Desbloquea Badges</h4>
                    <p className="text-sm text-gray-600">
                      Completa desafíos especiales para ganar insignias únicas
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">📈</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Sube de Nivel</h4>
                    <p className="text-sm text-gray-600">
                      Cada nivel requiere 100 × nivel actual en puntos
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🔥</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Mantén tu Racha</h4>
                    <p className="text-sm text-gray-600">
                      Completa viajes consecutivos para multiplicar tus puntos
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div>
            <Leaderboard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rewards;
