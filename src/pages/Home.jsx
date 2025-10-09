// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="text-8xl mb-6">🚗</div>
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Driver Trip
          </h1>
          <p className="text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Conectamos conductores y pasajeros para hacer tus viajes más económicos y sostenibles
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              to="/register"
              className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              Comenzar Ahora
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-lg border-2 border-blue-600"
            >
              Iniciar Sesión
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="bg-white rounded-lg shadow-xl p-8">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Viajes Seguros</h3>
              <p className="text-gray-600">
                Conductores verificados y sistema de calificaciones para tu tranquilidad
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-xl p-8">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Precios Justos</h3>
              <p className="text-gray-600">
                Ahorra dinero compartiendo gastos con otros pasajeros
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-xl p-8">
              <div className="text-5xl mb-4">🌱</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Eco-Friendly</h3>
              <p className="text-gray-600">
                Reduce tu huella de carbono compartiendo viajes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
