import { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [driver, setDriver] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedDriver = localStorage.getItem('driver');

    if (storedToken && storedDriver) {
      setToken(storedToken);
      setDriver(JSON.parse(storedDriver));
    }
    setLoading(false);
  }, []);

  const login = async (email, license_number) => {
    try {
      const response = await authApi.login(email, license_number);
      const { token, driver } = response;
      
      localStorage.setItem('token', token);
      localStorage.setItem('driver', JSON.stringify(driver));
      
      setToken(token);
      setDriver(driver);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al iniciar sesión' 
      };
    }
  };

  const register = async (data) => {
    try {
      const response = await authApi.register(data);
      const { token, driver } = response;
      
      localStorage.setItem('token', token);
      localStorage.setItem('driver', JSON.stringify(driver));
      
      setToken(token);
      setDriver(driver);
      
      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al registrarse' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('driver');
    setToken(null);
    setDriver(null);
  };

  const value = {
    driver,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};