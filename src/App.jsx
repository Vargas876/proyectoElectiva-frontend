import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

// Auth
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Passenger
import PassengerDashboard from './components/passenger/PassengerDashboard';
import RequestTrip from './components/passenger/RequestTrip';
import ViewOffers from './components/passenger/ViewOffers';

// Driver
import DriverDashboard from './components/driver/DriverDashboard';
import MakeOffer from './components/driver/MakeOffer';

// Shared
import ProtectedRoute from './components/shared/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Passenger Routes */}
            <Route
              path="/passenger/dashboard"
              element={
                <ProtectedRoute allowedRoles={['passenger']}>
                  <PassengerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/passenger/request-trip"
              element={
                <ProtectedRoute allowedRoles={['passenger']}>
                  <RequestTrip />
                </ProtectedRoute>
              }
            />
            <Route
              path="/passenger/offers/:requestId"
              element={
                <ProtectedRoute allowedRoles={['passenger']}>
                  <ViewOffers />
                </ProtectedRoute>
              }
            />
            
            {/* Driver Routes */}
            <Route
              path="/driver/dashboard"
              element={
                <ProtectedRoute allowedRoles={['driver']}>
                  <DriverDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver/make-offer/:requestId"
              element={
                <ProtectedRoute allowedRoles={['driver']}>
                  <MakeOffer />
                </ProtectedRoute>
              }
            />
            
            {/* Default Route */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;