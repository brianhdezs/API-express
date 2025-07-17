import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Importar rutas
import truckRoutes from './routes/truckRoutes.js';

// Configurar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3078;

// Middlewares globales
app.use(helmet()); // Seguridad
app.use(cors()); // CORS
app.use(morgan('combined')); // Logs
app.use(express.json({ limit: '10mb' })); // Parser JSON
app.use(express.urlencoded({ extended: true })); // Parser URL encoded

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno'
  });
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API de Truck Sense funcionando correctamente',
    version: '1.0.0',
    endpoints: {
      trucks: {
        'GET /api/trucks': 'Obtener todos los camiones',
        'POST /api/trucks': 'Crear un nuevo camión',
        'GET /api/trucks/:truckId': 'Obtener un camión por ID',
        'PUT /api/trucks/:truckId': 'Actualizar un camión',
        'DELETE /api/trucks/:truckId': 'Eliminar un camión',
        'GET /api/trucks/alert/:alertLevel': 'Obtener camiones por nivel de alerta'
      }
    }
  });
});

// Rutas de la API
app.use('/api/trucks', truckRoutes);

// Ruta para manejar 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado',
    availableEndpoints: [
      'GET /',
      'GET /api/trucks',
      'POST /api/trucks',
      'GET /api/trucks/:truckId',
      'PUT /api/trucks/:truckId',
      'DELETE /api/trucks/:truckId',
      'GET /api/trucks/alert/:alertLevel'
    ]
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚛 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`📡 API disponible en: http://localhost:${PORT}`);
  console.log(`📚 Documentación en: http://localhost:${PORT}/`);
});

export default app;