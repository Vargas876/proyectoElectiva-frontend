import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { driverApi } from '../api/driverApi';
import ErrorMessage from '../components/common/ErrorMessage';
import Footer from '../components/common/Footer';
import Loader from '../components/common/Loader';
import Navbar from '../components/common/Navbar';
import DriverBadges from '../components/driver/DriverBadges';
import ReviewList from '../components/review/ReviewList';
import { useAuth } from '../context/AuthContext';


const Profile = () => {
  const { user } = useAuth();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('info'); // 'info', 'reviews', 'badges'
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    vehicle_model: '',
    vehicle_color: '',
    vehicle_year: ''
  });

  useEffect(() => {
    if (user?.id) {
      fetchDriver();
    }
  }, [user]);

  const fetchDriver = async () => {
    try {
      setLoading(true);
      
      console.log('🔄 ===== RECARGANDO DRIVER =====');
      
      // 1. Obtener datos del driver
      const driverResponse = await driverApi.getById(user.id);
      console.log('👤 Driver recargado:');
      console.log('  - name:', driverResponse.data.name);
      console.log('  - phone:', driverResponse.data.phone);
      console.log('  - bio:', driverResponse.data.bio);
      console.log('  - vehicle_model:', driverResponse.data.vehicle_model);
      console.log('  - vehicle_color:', driverResponse.data.vehicle_color);
      console.log('  - vehicle_year:', driverResponse.data.vehicle_year);
      
      // 2. Obtener rewards por separado
      const rewardsResponse = await axios.get(`/rewards/driver/${user.id}`);
      
      // 3. Combinar ambos
      const driverWithRewards = {
        ...driverResponse.data,
        rewards: rewardsResponse.data || {
          points: 0,
          level: 1,
          badges: [],
          achievements: []
        }
      };
      
      setDriver(driverWithRewards);
      
      // Actualizar formData con los nuevos valores
      const newFormData = {
        name: driverResponse.data.name || '',
        email: driverResponse.data.email || '',
        phone: driverResponse.data.phone || '',
        bio: driverResponse.data.bio || '',
        vehicle_model: driverResponse.data.vehicle_model || '',
        vehicle_color: driverResponse.data.vehicle_color || '',
        vehicle_year: driverResponse.data.vehicle_year || ''
      };
      
      setFormData(newFormData);
      
      console.log('✅ FormData actualizado a:');
      console.log('  - name:', newFormData.name);
      console.log('  - phone:', newFormData.phone);
      console.log('  - bio:', newFormData.bio);
      console.log('  - vehicle_model:', newFormData.vehicle_model);
      console.log('  - vehicle_color:', newFormData.vehicle_color);
      console.log('  - vehicle_year:', newFormData.vehicle_year);
      
      console.log('🔄 ===== FIN RECARGA =====');
      
    } catch (error) {
      setError(error.message || 'Error al cargar el perfil');
      console.error('❌ Error al recargar:', error);
    } finally {
      setLoading(false);
    }
  };
  
  
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      console.log('📝 ===== INICIO DE ACTUALIZACIÓN =====');
      console.log('📝 ID del usuario:', user.id);
      console.log('📝 Datos ANTES de enviar:');
      console.log('  - name:', formData.name);
      console.log('  - phone:', formData.phone);
      console.log('  - bio:', formData.bio);
      console.log('  - vehicle_model:', formData.vehicle_model);
      console.log('  - vehicle_color:', formData.vehicle_color);
      console.log('  - vehicle_year:', formData.vehicle_year);
      
      // Actualizar el perfil
      const updateResponse = await driverApi.update(user.id, formData);
      console.log('✅ Respuesta del backend:', updateResponse);
      console.log('✅ Success:', updateResponse.success);
      
      // Ver datos actualizados devueltos por el backend
      console.log('✅ Datos devueltos por el backend:');
      console.log('  - name:', updateResponse.data.name);
      console.log('  - phone:', updateResponse.data.phone);
      console.log('  - bio:', updateResponse.data.bio);
      console.log('  - vehicle_model:', updateResponse.data.vehicle_model);
      console.log('  - vehicle_color:', updateResponse.data.vehicle_color);
      console.log('  - vehicle_year:', updateResponse.data.vehicle_year);
      
      if (updateResponse.success) {
        alert('✅ Perfil actualizado exitosamente');
        setEditing(false);
        
        console.log('🔄 Recargando datos del driver...');
        
        // RECARGAR DATOS
        await fetchDriver();
      } else {
        console.error('❌ Update no fue exitoso:', updateResponse);
        setError('Error al actualizar el perfil');
      }
      
    } catch (error) {
      console.error('❌ ===== ERROR EN ACTUALIZACIÓN =====');
      console.error('❌ Error completo:', error);
      setError(error.message || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };
  
  
  
  if (loading && !driver) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Loader size="lg" text="Cargando perfil..." />
      </div>
    );
  }

  if (error && !driver) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <ErrorMessage message={error} onRetry={fetchDriver} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              {/* Avatar */}
              {driver?.profile_picture ? (
                <img
                  src={driver.profile_picture}
                  alt={driver.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                  {driver?.name?.charAt(0).toUpperCase()}
                </div>
              )}

              {/* Info */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{driver?.name}</h1>
                <p className="text-gray-600">{driver?.email}</p>
                <div className="flex items-center mt-2 space-x-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-semibold">{driver?.rating?.toFixed(1) || '5.0'}</span>
                  </div>
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-600">{driver?.total_trips || 0} viajes</span>
                  <span className="text-gray-600">•</span>
                  {/* ✅ USAR driver.rewards.level */}
                  <span className="text-purple-600 font-semibold">
                    Nivel {driver?.rewards?.level || 1}
                  </span>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                ✏️ Editar Perfil
              </button>
            )}
          </div>
        </div>

        {/* Edit Form */}
        {editing && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Editar Información</h2>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biografía
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={3}
                    maxLength={500}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modelo del Vehículo
                  </label>
                  <input
                    type="text"
                    name="vehicle_model"
                    value={formData.vehicle_model}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color del Vehículo
                  </label>
                  <input
                    type="text"
                    name="vehicle_color"
                    value={formData.vehicle_color}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Año del Vehículo
                  </label>
                  <input
                    type="number"
                    name="vehicle_year"
                    value={formData.vehicle_year}
                    onChange={handleChange}
                    min={1990}
                    max={new Date().getFullYear() + 1}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                >
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ✅ Stats Cards - ACTUALIZADAS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
            <p className="text-sm opacity-90">Total de Viajes</p>
            <p className="text-4xl font-bold">{driver?.total_trips || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
            <p className="text-sm opacity-90">Completados</p>
            <p className="text-4xl font-bold">{driver?.completed_trips || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
            <p className="text-sm opacity-90">Nivel Actual</p>
            {/* ✅ USAR driver.rewards.level */}
            <p className="text-4xl font-bold">{driver?.rewards?.level || 1}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg shadow-md p-6 text-white">
            <p className="text-sm opacity-90">Puntos</p>
            {/* ✅ USAR driver.rewards.points */}
            <p className="text-4xl font-bold">{driver?.rewards?.points || 0}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('info')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'info'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                📋 Información
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'reviews'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                ⭐ Reseñas
              </button>
              <button
                onClick={() => setActiveTab('badges')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'badges'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                🏆 Badges
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Info Tab */}
            {activeTab === 'info' && (
              <div className="space-y-6">
                {/* Personal Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    👤 Información Personal
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold text-gray-900">{driver?.email}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Teléfono</p>
                      <p className="font-semibold text-gray-900">{driver?.phone}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Licencia</p>
                      <p className="font-semibold text-gray-900">{driver?.license_number}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Estado</p>
                      <p className="font-semibold text-gray-900 capitalize">{driver?.status}</p>
                    </div>
                  </div>
                </div>

                {/* Vehicle Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    🚗 Información del Vehículo
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Tipo</p>
                      <p className="font-semibold text-gray-900 capitalize">{driver?.vehicle_type}</p>
                    </div>
                    {driver?.vehicle_plate && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Placa</p>
                        <p className="font-semibold text-gray-900">{driver.vehicle_plate}</p>
                      </div>
                    )}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Capacidad</p>
                      <p className="font-semibold text-gray-900">{driver?.vehicle_capacity} pasajeros</p>
                    </div>
                    {driver?.vehicle_model && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Modelo</p>
                        <p className="font-semibold text-gray-900">{driver.vehicle_model}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bio */}
                {driver?.bio && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      📝 Biografía
                    </h3>
                    <p className="text-gray-700 bg-gray-50 rounded-lg p-4">{driver.bio}</p>
                  </div>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && driver?.id && (
              <ReviewList driverId={driver.id} />
            )}

            {/* ✅ Badges Tab - PASAR driver completo */}
            {activeTab === 'badges' && <DriverBadges driver={driver} />}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
