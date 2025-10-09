// src/App.jsx
import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { SocketProvider } from './context/SocketContext';

// Páginas
import DriverProfile from './components/driver/DriverProfile'; // ✅ AGREGAR
import Dashboard from './pages/Dashboard';
import Drivers from './pages/Drivers';
import Home from './pages/Home';
import Login from './pages/Login';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import RecurringTrips from './pages/RecurringTrips';
import Register from './pages/Register';
import Rewards from './pages/Rewards';
import TripDetails from './pages/TripDetails';
import Trips from './pages/Trips';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <NotificationProvider>
          <Router
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true
            }}
          >
            <Routes>
              {/* Rutas públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Rutas protegidas */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/drivers"
                element={
                  <ProtectedRoute>
                    <Drivers />
                  </ProtectedRoute>
                }
              />
              {/* ✅ AGREGAR ESTA RUTA */}
              <Route
                path="/drivers/:id"
                element={
                  <ProtectedRoute>
                    <DriverProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trips"
                element={
                  <ProtectedRoute>
                    <Trips />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trips/:id"
                element={
                  <ProtectedRoute>
                    <TripDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/rewards"
                element={
                  <ProtectedRoute>
                    <Rewards />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recurring-trips"
                element={
                  <ProtectedRoute>
                    <RecurringTrips />
                  </ProtectedRoute>
                }
              />

              {/* Ruta 404 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </NotificationProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
