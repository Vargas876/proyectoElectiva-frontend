import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    license_number: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await register(formData);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Crear Cuenta
          </h2>
          <p className="text-gray-600">
            Regístrate como conductor
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label className="label">Nombre Completo</label>
              <input
                type="text"
                className="input"
                placeholder="Juan Pérez"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                minLength={3}
              />
            </div>

            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="label">Teléfono</label>
              <input
                type="tel"
                className="input"
                placeholder="+57 300 1234567"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="label">Número de Licencia</label>
              <input
                type="text"
                className="input"
                placeholder="ABC123456"
                value={formData.license_number}
                onChange={(e) => setFormData({...formData, license_number: e.target.value.toUpperCase()})}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;