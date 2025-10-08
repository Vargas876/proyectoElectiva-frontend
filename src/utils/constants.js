export const API_URL = import.meta.env.VITE_API_URL || 'https://proyectoelectiva-pyl0.onrender.com/api';

export const TRIP_STATUS = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const DRIVER_STATUS = {
  AVAILABLE: 'available',
  BUSY: 'busy',
  OFFLINE: 'offline'
};

export const STATUS_LABELS = {
  scheduled: 'Programado',
  in_progress: 'En Progreso',
  completed: 'Completado',
  cancelled: 'Cancelado'
};

export const STATUS_COLORS = {
  scheduled: 'badge-blue',
  in_progress: 'badge-yellow',
  completed: 'badge-green',
  cancelled: 'badge-red'
};