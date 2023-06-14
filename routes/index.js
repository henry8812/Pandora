const express = require('express');
const router = express.Router();

// Ruta de inicio
router.get('/', (req, res) => {
  res.render('index', { title: 'Base de Conocimiento', req });
});

// Ruta de autenticación
router.use('/auth', require('./auth'));

// Ruta de gestión de artículos
router.use('/articles', require('./articles'));

// Ruta de gestión de recursos
router.use('/resources', require('./resources'));

// Ruta de gestión de usuarios
router.use('/users', require('./users'));

// Ruta del dashboard
router.use('/dashboard', require('./dashboard'));

module.exports = router;
