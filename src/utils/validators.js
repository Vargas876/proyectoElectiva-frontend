// Validar email
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Validar teléfono colombiano
  export const isValidPhone = (phone) => {
    const phoneRegex = /^(\+57)?[\s-]?3\d{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };
  
  // Validar placa vehicular
  export const isValidPlate = (plate) => {
    const plateRegex = /^[A-Z]{3}\d{3}$/;
    return plateRegex.test(plate);
  };
  
  // Validar contraseña fuerte
  export const isStrongPassword = (password) => {
    // Mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };
  
  // Validar número de licencia
  export const isValidLicenseNumber = (license) => {
    // Formato típico: 12345678 (8 dígitos)
    return /^\d{8,10}$/.test(license);
  };
  
  // Validar rating
  export const isValidRating = (rating) => {
    const num = Number(rating);
    return !isNaN(num) && num >= 1 && num <= 5;
  };
  
  // Validar precio
  export const isValidPrice = (price) => {
    const num = Number(price);
    return !isNaN(num) && num >= 0;
  };
  
  // Validar fecha futura
  export const isFutureDate = (date) => {
    return new Date(date) > new Date();
  };
  
  // Validar rango de fechas
  export const isValidDateRange = (startDate, endDate) => {
    return new Date(startDate) < new Date(endDate);
  };
  
  // Sanitizar input
  export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input
      .trim()
      .replace(/[<>]/g, ''); // Eliminar < y > para prevenir XSS básico
  };
  
  // Validar URL
  export const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };
  