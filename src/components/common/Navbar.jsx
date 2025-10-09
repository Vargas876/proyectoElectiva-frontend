// src/components/common/Navbar.jsx (ACTUALIZACIÓN)
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../notification/NotificationBell';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-2xl font-bold text-blue-600">
              🚗 Driver Trip
            </Link>
            
            {user && (
              <div className="ml-10 flex items-center space-x-4">
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium">
                  Dashboard
                </Link>
                <Link to="/trips" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium">
                  Viajes
                </Link>
                <Link to="/drivers" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium">
                  Conductores
                </Link>
                <Link to="/recurring-trips" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium">
                  Recurrentes
                </Link>
                <Link to="/rewards" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium">
                  🏆 Recompensas
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Notification Bell */}
                <NotificationBell />
                
                {/* User Menu */}
                <Link to="/profile" className="text-gray-700 hover:text-blue-600">
                  <span className="font-medium">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium">
                  Iniciar Sesión
                </Link>
                <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
