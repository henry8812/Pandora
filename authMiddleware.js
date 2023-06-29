const express = require('express');
const cookieParser = require('cookie-parser');
const router = express.Router();
const NodeCache = require('node-cache');
// Crea una instancia de NodeCache
const sessionCache = new NodeCache();

// Middleware para manejar las cookies
router.use(cookieParser());

// Middleware para verificar la autenticación del usuario
const authMiddleware = (req, res, next) => {
    const sessionId = req.cookies.sessionId;
    const currentUrl = req.originalUrl;
    if (currentUrl.startsWith('/assets')) {
        next();
        return;
      }
  
    // Excluir la URL "/auth/login" del middleware
    if (currentUrl === '/auth/login') {
      next();
      return;
    }
  
    if (sessionId) {
      // La sesión está activa, obtener los datos de la sesión
      const email = sessionId;
  
      console.log("Hay sesión");
      console.log("Email:", email);
  
      next(); // Pasar al siguiente middleware
    } else {
      // La sesión no está activa, redirigir a la página de inicio de sesión
      console.log("No hay sesión");
      res.clearCookie('sessionId');
      res.redirect('/auth/login');
    }
  };
  
  module.exports = authMiddleware;
  
