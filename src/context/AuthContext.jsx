// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (storedUser && storedUser !== 'undefined' && storedUser !== 'null' && token) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && typeof parsedUser === 'object') {
          setUser(parsedUser);
        }
      }
    } catch (error) {
      console.error('Error al cargar usuario:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, license_number) => {
    try {
      console.log('🔐 Intentando login con:', { email, license_number });
      
      const response = await authApi.login(email, license_number);
      
      console.log('📥 Respuesta del backend:', response);
      
      // ✅ CAMBIO: Verificar que response tenga success y token
      if (response && response.success && response.token && response.driver) {
        const { token, driver } = response;
        
        // Guardar en localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(driver));
        
        // Actualizar estado
        setUser(driver);
        
        console.log('✅ Login exitoso, usuario:', driver);
        
        return { success: true, user: driver };
      } else {
        console.error('❌ Respuesta del backend sin success/token/driver:', response);
        return { 
          success: false, 
          error: response?.message || 'Formato de respuesta inválido' 
        };
      }
    } catch (error) {
      console.error('❌ Error en login:', error);
      return { 
        success: false, 
        error: error.message || 'Error al conectar con el servidor' 
      };
    }
  };

  const register = async (userData) => {
    try {
      console.log('📝 Intentando registro con:', userData);
      
      const response = await authApi.register(userData);
      
      console.log('📥 Respuesta del registro:', response);
      
      if (response && response.success && response.token && response.driver) {
        const { token, driver } = response;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(driver));
        setUser(driver);
        
        console.log('✅ Registro exitoso');
        
        return { success: true, user: driver };
      } else {
        return { 
          success: false, 
          error: response?.message || 'Error al registrarse' 
        };
      }
    } catch (error) {
      console.error('❌ Error en registro:', error);
      return { 
        success: false, 
        error: error.message || 'Error al conectar con el servidor' 
      };
    }
  };

  const logout = () => {
    console.log('👋 Cerrando sesión');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <div>Cargando...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export default AuthContext;
