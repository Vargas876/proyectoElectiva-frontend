// Estados de viaje
export const TRIP_STATUS = {
    SCHEDULED: 'scheduled',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
  };
  
  export const TRIP_STATUS_LABELS = {
    [TRIP_STATUS.SCHEDULED]: 'Programado',
    [TRIP_STATUS.IN_PROGRESS]: 'En Progreso',
    [TRIP_STATUS.COMPLETED]: 'Completado',
    [TRIP_STATUS.CANCELLED]: 'Cancelado'
  };
  
  // Estados de conductor
  export const DRIVER_STATUS = {
    AVAILABLE: 'available',
    BUSY: 'busy',
    OFFLINE: 'offline'
  };
  
  export const DRIVER_STATUS_LABELS = {
    [DRIVER_STATUS.AVAILABLE]: 'Disponible',
    [DRIVER_STATUS.BUSY]: 'Ocupado',
    [DRIVER_STATUS.OFFLINE]: 'Desconectado'
  };
  
  // Tipos de vehículo
  export const VEHICLE_TYPES = {
    SEDAN: 'sedan',
    SUV: 'suv',
    VAN: 'van',
    MINIBUS: 'minibus',
    HATCHBACK: 'hatchback',
    COUPE: 'coupe'
  };
  
  export const VEHICLE_TYPE_LABELS = {
    [VEHICLE_TYPES.SEDAN]: 'Sedán',
    [VEHICLE_TYPES.SUV]: 'SUV',
    [VEHICLE_TYPES.VAN]: 'Van',
    [VEHICLE_TYPES.MINIBUS]: 'Minibús',
    [VEHICLE_TYPES.HATCHBACK]: 'Hatchback',
    [VEHICLE_TYPES.COUPE]: 'Coupé'
  };
  
  // Tipos de notificación
  export const NOTIFICATION_TYPES = {
    TRIP_REQUEST: 'trip_request',
    TRIP_CANCELLED: 'trip_cancelled',
    TRIP_STARTED: 'trip_started',
    TRIP_COMPLETED: 'trip_completed',
    PAYMENT_RECEIVED: 'payment_received',
    NEW_MESSAGE: 'new_message',
    NEW_REVIEW: 'new_review',
    BADGE_EARNED: 'badge_earned',
    LEVEL_UP: 'level_up',
    SOS_ALERT: 'sos_alert',
    SYSTEM: 'system'
  };
  
  // Razones de emergencia
  export const EMERGENCY_REASONS = {
    ACCIDENT: 'accident',
    MEDICAL: 'medical',
    SECURITY: 'security',
    VEHICLE_PROBLEM: 'vehicle_problem',
    OTHER: 'other'
  };
  
  export const EMERGENCY_REASON_LABELS = {
    [EMERGENCY_REASONS.ACCIDENT]: 'Accidente',
    [EMERGENCY_REASONS.MEDICAL]: 'Emergencia Médica',
    [EMERGENCY_REASONS.SECURITY]: 'Problema de Seguridad',
    [EMERGENCY_REASONS.VEHICLE_PROBLEM]: 'Problema del Vehículo',
    [EMERGENCY_REASONS.OTHER]: 'Otro'
  };
  
  // Tags de reviews
  export const REVIEW_TAGS = {
    POSITIVE: [
      { value: 'punctual', label: '⏰ Puntual' },
      { value: 'friendly', label: '😊 Amigable' },
      { value: 'safe_driver', label: '🛡️ Conductor Seguro' },
      { value: 'clean_vehicle', label: '✨ Vehículo Limpio' },
      { value: 'good_conversation', label: '💬 Buena Conversación' },
      { value: 'professional', label: '👔 Profesional' },
      { value: 'comfortable', label: '🛋️ Cómodo' }
    ],
    NEGATIVE: [
      { value: 'late', label: '⏱️ Tarde' },
      { value: 'rude', label: '😠 Grosero' },
      { value: 'reckless', label: '⚠️ Imprudente' }
    ]
  };
  
  // Rareza de badges
  export const BADGE_RARITY = {
    COMMON: 'common',
    RARE: 'rare',
    EPIC: 'epic',
    LEGENDARY: 'legendary'
  };
  
  export const BADGE_RARITY_LABELS = {
    [BADGE_RARITY.COMMON]: 'Común',
    [BADGE_RARITY.RARE]: 'Raro',
    [BADGE_RARITY.EPIC]: 'Épico',
    [BADGE_RARITY.LEGENDARY]: 'Legendario'
  };
  
  // Configuración de paginación
  export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
  };
  
  // Configuración de archivos
  export const FILE_UPLOAD = {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
    ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.pdf']
  };
  
  // URLs de API
  export const API_ENDPOINTS = {
    AUTH: '/auth',
    DRIVERS: '/drivers',
    TRIPS: '/trips',
    REVIEWS: '/reviews',
    NOTIFICATIONS: '/notifications',
    REWARDS: '/rewards',
    EMERGENCY: '/emergency',
    RECURRING_TRIPS: '/recurring-trips',
    VERIFICATION: '/verification'
  };
  
  // Días de la semana
  export const DAYS_OF_WEEK = [
    { value: 0, label: 'Domingo', short: 'Dom' },
    { value: 1, label: 'Lunes', short: 'Lun' },
    { value: 2, label: 'Martes', short: 'Mar' },
    { value: 3, label: 'Miércoles', short: 'Mié' },
    { value: 4, label: 'Jueves', short: 'Jue' },
    { value: 5, label: 'Viernes', short: 'Vie' },
    { value: 6, label: 'Sábado', short: 'Sáb' }
  ];
  