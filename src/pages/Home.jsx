import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            🚗 Driver Trip
          </h1>
          <p className="text-2xl text-gray-600 mb-8">
            Comparte viajes, ahorra costos, conoce gente nueva
          </p>
          <p className="text-lg text-gray-500 mb-12">
            Conectamos conductores con pasajeros para hacer tus viajes más económicos y amigables
          </p>

          <div className="flex justify-center gap-4 mb-16">
            {isAuthenticated ? (
              <>
                <Link to="/trips" className="btn btn-primary text-lg px-8 py-3">
                  Ver Viajes Disponibles
                </Link>
                <Link to="/create-trip" className="btn btn-success text-lg px-8 py-3">
                  Ofrecer un Viaje
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary text-lg px-8 py-3">
                  Comenzar Ahora
                </Link>
                <Link to="/login" className="btn btn-secondary text-lg px-8 py-3">
                  Iniciar Sesión
                </Link>
              </>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="card text-center">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-2">Ahorra Dinero</h3>
              <p className="text-gray-600">
                Comparte los gastos del viaje entre varios pasajeros
              </p>
            </div>

            <div className="card text-center">
              <div className="text-5xl mb-4">🌟</div>
              <h3 className="text-xl font-bold mb-2">Sistema de Rating</h3>
              <p className="text-gray-600">
                Califica y elige conductores con buena reputación
              </p>
            </div>

            <div className="card text-center">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-2">Fácil y Rápido</h3>
              <p className="text-gray-600">
                Reserva tu asiento en segundos desde cualquier dispositivo
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;