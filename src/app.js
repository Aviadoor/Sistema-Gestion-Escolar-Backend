// =============================================
// SANTO TOMÁS DE AQUINO — Configuración de Express
// =============================================

const express = require('express');
const path = require('path');

const { corsMiddleware } = require('./config/cors');
const { proteccionCsrf } = require('./middlewares/csrfMiddleware');
const { prevenirInyeccionSQL } = require('./middlewares/validationMiddleware');
const { rutaNoEncontrada, manejadorErrores } = require('./middlewares/errorMiddleware');
const apiRoutes = require('./routes');

const app = express();

// ---------------------------------------------
// Middlewares globales de seguridad y parseo
// ---------------------------------------------
app.disable('x-powered-by');
app.use(corsMiddleware);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(prevenirInyeccionSQL);
app.use('/api', proteccionCsrf);

// ---------------------------------------------
// Archivos estáticos del frontend (HTML, CSS, JS Vanilla)
// ---------------------------------------------
const frontendPath = path.join(__dirname, '../../frontend');
app.use(express.static(frontendPath));
app.use('/uploads', express.static(path.join(frontendPath, 'uploads')));

// ---------------------------------------------
// Rutas de la API
// ---------------------------------------------
app.use('/api', apiRoutes);

// ---------------------------------------------
// Ruta raíz — sirve la página principal
// ---------------------------------------------
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// ---------------------------------------------
// Ruta no encontrada (404) y Manejo de errores globales
// ---------------------------------------------
app.use(rutaNoEncontrada);
app.use(manejadorErrores);

module.exports = app;

