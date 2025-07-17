// Middleware para validar datos de camiones
export const validateTruckData = (req, res, next) => {
  const { driverName, location, alertLevel, timestamp } = req.body;
  const errors = [];

  // Validar driverName
  if (!driverName || typeof driverName !== 'string' || driverName.trim().length === 0) {
    errors.push('driverName es obligatorio y debe ser texto');
  }

  // Validar location
  if (!location || typeof location !== 'object') {
    errors.push('location es obligatorio y debe ser un objeto');
  } else {
    // Validar latitude
    if (typeof location.latitude !== 'number' || location.latitude < -90 || location.latitude > 90) {
      errors.push('location.latitude debe ser un número entre -90 y 90');
    }
    
    // Validar longitude
    if (typeof location.longitude !== 'number' || location.longitude < -180 || location.longitude > 180) {
      errors.push('location.longitude debe ser un número entre -180 y 180');
    }
  }

  // Validar alertLevel
  const validAlertLevels = ['moderado', 'alto', 'critico'];
  if (!alertLevel || !validAlertLevels.includes(alertLevel)) {
    errors.push('alertLevel debe ser: "moderado", "alto" o "critico"');
  }

  // Validar timestamp
  if (!timestamp || typeof timestamp !== 'number' || timestamp <= 0) {
    errors.push('timestamp debe ser un número positivo en milisegundos');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errors
    });
  }

  next();
};

// Middleware para validar ID de camión
export const validateTruckId = (req, res, next) => {
  const { truckId } = req.params;
  
  if (!truckId || truckId.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'ID de camión es requerido'
    });
  }

  next();
};