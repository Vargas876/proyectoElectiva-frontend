import { Bell, Car, LogOut, Users } from 'lucide-react';
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SocketContext } from '../../context/SocketContext';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { notifications, clearNotifications } = useContext(SocketContext);
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
            <Link to="/" className="flex items-center space-x-2">
              <Car className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">RideShare</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notificaciones */}
            <div className="relative">
              <button
                onClick={clearNotifications}
                className="p-2 rounded-full hover:bg-gray-100 relative"
              >
                <Bell className="w-6 h-6 text-gray-600" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
            </div>

            {/* Usuario */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2">
                {user?.role === 'driver' ? (
                  <Car className="w-5 h-5 text-blue-600" />
                ) : (
                  <Users className="w-5 h-5 text-green-600" />
                )}
                <span className="font-medium text-gray-700">{user?.name}</span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Salir</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;