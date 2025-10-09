// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { driverApi } from '../api/driverApi';
import { tripApi } from '../api/tripApi';
import Footer from '../components/common/Footer';
import Loader from '../components/common/Loader';
import Navbar from '../components/common/Navbar';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTrips: 0,
    completedTrips: 0,
    scheduledTrips: 0,
    totalDrivers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [tripsResponse, driversResponse] = await Promise.all([
        tripApi.getAll(),
        driverApi.getAll()
      ]);

      const trips = tripsResponse.data || [];
      const drivers = driversResponse.data || [];

      setStats({
        totalTrips: trips.length,
        completedTrips: trips.filter(t => t.status === 'completed').length,
        scheduledTrips: trips.filter(t => t.status === 'scheduled').length,
        totalDrivers: drivers.length
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Loader size="lg" text="Cargando dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            ¡Bienvenido, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Aquí está un resumen de la plataforma Driver Trip
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm opacity-90">Total Viajes</p>
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
              </svg>
            </div>
            <p className="text-4xl font-bold">{stats.totalTrips}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm opacity-90">Completados</p>
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-4xl font-bold">{stats.completedTrips}</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg shadow-md p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm opacity-90">Programados</p>
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-4xl font-bold">{stats.scheduledTrips}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm opacity-90">Conductores</p>
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
            <p className="text-4xl font-bold">{stats.totalDrivers}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/trips"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Ver Viajes</h3>
                <p className="text-sm text-gray-600">Explora todos los viajes</p>
              </div>
            </div>
          </Link>

          <Link
            to="/drivers"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Conductores</h3>
                <p className="text-sm text-gray-600">Gestionar conductores</p>
              </div>
            </div>
          </Link>

          <Link
            to="/rewards"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Recompensas</h3>
                <p className="text-sm text-gray-600">Ver tu progreso</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-2">🚀 Bienvenido a Driver Trip</h2>
          <p className="text-blue-50 mb-6">
            Conectamos conductores y pasajeros para hacer tus viajes más económicos y sostenibles
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-3xl font-bold">✅</p>
              <p className="text-sm mt-2">Viajes Seguros</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-3xl font-bold">💰</p>
              <p className="text-sm mt-2">Precios Justos</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-3xl font-bold">🌱</p>
              <p className="text-sm mt-2">Eco-Friendly</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
