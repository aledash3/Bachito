const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensor.controller');

// 1. Ingesta desde el ESP32
router.post('/', sensorController.receiveData);

// 2. Consulta de baches para Mapa y Panel Admin
router.get('/', sensorController.getAllData);

// 3. Actualización de coordenadas o estado
router.patch('/:id', sensorController.updateBache);

// 4. Eliminación de registro
router.delete('/:id', sensorController.deleteBache);

module.exports = router;
