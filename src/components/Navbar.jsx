import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, driver, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🚗</span>
            <span className="text-xl font-bold text-blue-600">Driver Trip</span>
          </Link>

          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition">
                  Dashboard
                </Link>
                <Link to="/trips" className="text-gray-700 hover:text-blue-600 transition">
                  Viajes
                </Link>
                <Link to="/create-trip" className="text-gray-700 hover:text-blue-600 transition">
                  Crear Viaje
                </Link>
                <Link to="/statistics" className="text-gray-700 hover:text-blue-600 transition">
                  Estadísticas
                </Link>
                
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold">{driver?.name}</p>
                    <p className="text-xs text-gray-500">⭐ {driver?.rating || 5.0}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="btn btn-danger text-sm"
                  >
                    Salir
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 transition">
                  Iniciar Sesión
                </Link>
                <Link to="/register" className="btn btn-primary">
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