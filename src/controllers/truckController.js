import { database } from '../config/firebase.js';
import { ref, push, get, update, remove, child } from 'firebase/database';

// Crear un nuevo camión
export const createTruck = async (req, res) => {
  try {
    const { driverName, location, alertLevel, timestamp } = req.body;
    
    const truckData = {
      driverName: driverName.trim(),
      location: {
        latitude: location.latitude,
        longitude: location.longitude
      },
      alertLevel,
      timestamp,
      createdAt: Date.now()
    };

    // Generar un nuevo ID para el camión
    const trucksRef = ref(database, 'trucks');
    const newTruckRef = await push(trucksRef, truckData);
    
    res.status(201).json({
      success: true,
      message: 'Camión creado exitosamente',
      data: {
        id: newTruckRef.key,
        ...truckData
      }
    });
  } catch (error) {
    console.error('Error al crear camión:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener todos los camiones
export const getAllTrucks = async (req, res) => {
  try {
    const trucksRef = ref(database, 'trucks');
    const snapshot = await get(trucksRef);
    
    if (snapshot.exists()) {
      const trucks = snapshot.val();
      
      // Convertir el objeto a array con IDs
      const trucksArray = Object.keys(trucks).map(key => ({
        id: key,
        ...trucks[key]
      }));
      
      res.json({
        success: true,
        message: 'Camiones obtenidos exitosamente',
        data: trucksArray,
        count: trucksArray.length
      });
    } else {
      res.json({
        success: true,
        message: 'No hay camiones registrados',
        data: [],
        count: 0
      });
    }
  } catch (error) {
    console.error('Error al obtener camiones:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener un camión por ID
export const getTruckById = async (req, res) => {
  try {
    const { truckId } = req.params;
    const truckRef = ref(database, `trucks/${truckId}`);
    const snapshot = await get(truckRef);
    
    if (snapshot.exists()) {
      const truck = snapshot.val();
      res.json({
        success: true,
        message: 'Camión encontrado',
        data: {
          id: truckId,
          ...truck
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Camión no encontrado'
      });
    }
  } catch (error) {
    console.error('Error al obtener camión:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Actualizar un camión
export const updateTruck = async (req, res) => {
  try {
    const { truckId } = req.params;
    const { driverName, location, alertLevel, timestamp } = req.body;
    
    // Verificar si el camión existe
    const truckRef = ref(database, `trucks/${truckId}`);
    const snapshot = await get(truckRef);
    
    if (!snapshot.exists()) {
      return res.status(404).json({
        success: false,
        message: 'Camión no encontrado'
      });
    }
    
    const updateData = {
      driverName: driverName.trim(),
      location: {
        latitude: location.latitude,
        longitude: location.longitude
      },
      alertLevel,
      timestamp,
      updatedAt: Date.now()
    };
    
    await update(truckRef, updateData);
    
    res.json({
      success: true,
      message: 'Camión actualizado exitosamente',
      data: {
        id: truckId,
        ...updateData
      }
    });
  } catch (error) {
    console.error('Error al actualizar camión:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Eliminar un camión
export const deleteTruck = async (req, res) => {
  try {
    const { truckId } = req.params;
    
    // Verificar si el camión existe
    const truckRef = ref(database, `trucks/${truckId}`);
    const snapshot = await get(truckRef);
    
    if (!snapshot.exists()) {
      return res.status(404).json({
        success: false,
        message: 'Camión no encontrado'
      });
    }
    
    await remove(truckRef);
    
    res.json({
      success: true,
      message: 'Camión eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar camión:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener camiones por nivel de alerta
export const getTrucksByAlertLevel = async (req, res) => {
  try {
    const { alertLevel } = req.params;
    const validAlertLevels = ['moderado', 'alto', 'critico'];
    
    if (!validAlertLevels.includes(alertLevel)) {
      return res.status(400).json({
        success: false,
        message: 'Nivel de alerta inválido. Debe ser: moderado, alto o critico'
      });
    }
    
    const trucksRef = ref(database, 'trucks');
    const snapshot = await get(trucksRef);
    
    if (snapshot.exists()) {
      const trucks = snapshot.val();
      
      // Filtrar camiones por nivel de alerta
      const filteredTrucks = Object.keys(trucks)
        .filter(key => trucks[key].alertLevel === alertLevel)
        .map(key => ({
          id: key,
          ...trucks[key]
        }));
      
      res.json({
        success: true,
        message: `Camiones con nivel de alerta ${alertLevel}`,
        data: filteredTrucks,
        count: filteredTrucks.length
      });
    } else {
      res.json({
        success: true,
        message: 'No hay camiones registrados',
        data: [],
        count: 0
      });
    }
  } catch (error) {
    console.error('Error al obtener camiones por alerta:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};