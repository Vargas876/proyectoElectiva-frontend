import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    // Datos personales
    name: '',
    email: '',
    phone: '',
    license_number: '',
    
    // Datos del vehículo
    vehicle_type: 'sedan',
    vehicle_plate: '',
    vehicle_capacity: 4,
    vehicle_model: '',
    vehicle_year: new Date().getFullYear(),
    vehicle_color: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1); // 1: Personal, 2: Vehicle
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const vehicleTypes = [
    { value: 'sedan', label: 'Sedán' },
    { value: 'suv', label: 'SUV' },
    { value: 'van', label: 'Van' },
    { value: 'minibus', label: 'Minibús' },
    { value: 'hatchback', label: 'Hatchback' },
    { value: 'coupe', label: 'Coupé' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNextStep = () => {
    // Validar campos del paso 1
    if (!formData.name || !formData.email || !formData.phone || !formData.license_number) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }
    setError('');
    setCurrentStep(2);
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await register(formData);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Error al registrarse');
      }
    } catch (err) {
      setError(err.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🚗</div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Crear Cuenta
          </h2>
          <p className="text-gray-600">
            Regístrate como conductor en Driver Trip
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              } font-semibold`}>
                1
              </div>
              <span className={`ml-2 ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-600'} font-medium`}>
                Datos Personales
              </span>
            </div>
            
            <div className={`w-24 h-1 mx-4 ${
              currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'
            }`}></div>
            
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              } font-semibold`}>
                2
              </div>
              <span className={`ml-2 ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-600'} font-medium`}>
                Datos del Vehículo
              </span>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            {/* STEP 1: Personal Info */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Información Personal
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Juan Pérez"
                      required
                      minLength={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+57 300 123 4567"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* License Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de Licencia *
                    </label>
                    <input
                      type="text"
                      name="license_number"
                      value={formData.license_number}
                      onChange={handleChange}
                      placeholder="ABC12345"
                      required
                      maxLength={10}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Siguiente: Datos del Vehículo →
                </button>
              </div>
            )}

            {/* STEP 2: Vehicle Info */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Información del Vehículo
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Vehicle Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Vehículo *
                    </label>
                    <select
                      name="vehicle_type"
                      value={formData.vehicle_type}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {vehicleTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Vehicle Plate */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Placa del Vehículo
                    </label>
                    <input
                      type="text"
                      name="vehicle_plate"
                      value={formData.vehicle_plate}
                      onChange={handleChange}
                      placeholder="ABC123"
                      maxLength={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                    />
                  </div>

                  {/* Vehicle Capacity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capacidad (pasajeros) *
                    </label>
                    <input
                      type="number"
                      name="vehicle_capacity"
                      value={formData.vehicle_capacity}
                      onChange={handleChange}
                      required
                      min={1}
                      max={20}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Vehicle Model */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Modelo del Vehículo
                    </label>
                    <input
                      type="text"
                      name="vehicle_model"
                      value={formData.vehicle_model}
                      onChange={handleChange}
                      placeholder="Toyota Corolla"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Vehicle Year */}
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Vehicle Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color del Vehículo
                    </label>
                    <input
                      type="text"
                      name="vehicle_color"
                      value={formData.vehicle_color}
                      onChange={handleChange}
                      placeholder="Blanco"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                  >
                    ← Volver
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Registrando...
                      </span>
                    ) : (
                      'Crear Cuenta'
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Login Link */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link
                to="/login"
                className="text-blue-600 font-semibold hover:underline"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm text-blue-800 font-medium">
                Todos los datos son seguros
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Los campos marcados con * son obligatorios. La información del vehículo nos ayuda a brindar un mejor servicio.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
