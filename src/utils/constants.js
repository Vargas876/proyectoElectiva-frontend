export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
export const API_URL = import.meta.env.VITE_API_URL;
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const TRIP_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REJECTED: 'rejected'
};

export const USER_ROLES = {
  PASSENGER: 'passenger',
  DRIVER: 'driver'
};

// Coordenadas por defecto (Fusagasugá, Colombia)
export const DEFAULT_CENTER = {
  lat: 4.3369,
  lng: -74.3639
};