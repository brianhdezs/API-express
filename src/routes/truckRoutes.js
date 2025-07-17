import express from 'express';
import {
  createTruck,
  getAllTrucks,
  getTruckById,
  updateTruck,
  deleteTruck,
  getTrucksByAlertLevel
} from '../controllers/truckController.js';
import { validateTruckData, validateTruckId } from '../middleware/validation.js';

const router = express.Router();

// Rutas para camiones
router.post('/', validateTruckData, createTruck);
router.get('/', getAllTrucks);
router.get('/alert/:alertLevel', getTrucksByAlertLevel);
router.get('/:truckId', validateTruckId, getTruckById);
router.put('/:truckId', validateTruckId, validateTruckData, updateTruck);
router.delete('/:truckId', validateTruckId, deleteTruck);

export default router;