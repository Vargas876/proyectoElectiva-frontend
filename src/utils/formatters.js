// src/utils/formatters.js
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

// Formatear moneda colombiana
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Formatear fecha completa
export const formatDate = (date, formatStr = 'PPP') => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: es });
};

// Formatear hora
export const formatTime = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'p', { locale: es });
};

// Formatear fecha y hora
export const formatDateTime = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'PPp', { locale: es });
};

// Tiempo relativo (hace X minutos/horas/días)
export const formatRelativeTime = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: es });
};

// Formatear número de teléfono
export const formatPhone = (phone) => {
  if (!phone) return '';
  // Formato: +57 300 123 4567
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+57 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  return phone;
};

// Formatear distancia
export const formatDistance = (km) => {
  if (!km) return 'N/A';
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
};

// Formatear duración
export const formatDuration = (minutes) => {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins} min`;
  } else if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${mins}min`;
};

// Capitalizar primera letra
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Truncar texto
export const truncate = (str, length = 100) => {
  if (!str) return '';
  if (str.length <= length) return str;
  return `${str.substring(0, length)}...`;
};
