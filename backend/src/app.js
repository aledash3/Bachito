const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Conexión a la base de datos
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas de la API
const authRoutes = require('./routes/auth');
const sensorRoutes = require('./routes/sensor.routes');

app.use('/api/auth', authRoutes);
app.use('/api/sensores', sensorRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Bachito API en funcionamiento' });
});

module.exports = app;
