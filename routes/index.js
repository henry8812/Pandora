const express = require('express');
const cookieParser = require('cookie-parser');
const router = express.Router();
const NodeCache = require('node-cache');

// Crea una instancia de NodeCache
const sessionCache = new NodeCache();

// Middleware para manejar las cookies
router.use(cookieParser());

// Ruta de inicio
router.get('/', (req, res) => {
  // Verificar si la cookie de sesión existe
  const sessionId = req.cookies.sessionId;

  if (sessionId) {
    // La sesión está activa, obtener los datos de la sesión
    const email = sessionId;

    console.log("Hay sesión");
    console.log("Email:", email);

    res.render('index', { title: 'Base de Conocimiento', req });
  } else {
    // La sesión no está activa, redirigir a la página de inicio de sesión
    console.log("No hay sesión");
    res.clearCookie('sessionId');
    res.redirect('/auth/login');
  }
});

// Ruta de autenticación
router.use('/auth', require('./auth'));
router.use('/articles', require('./articles'));
router.use('/guides', require('./guides'));
router.use('/resources', require('./resources'));



module.exports = router;
