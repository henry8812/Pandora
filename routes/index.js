const express = require('express');
const cookieParser = require('cookie-parser');
const router = express.Router();
const NodeCache = require('node-cache');
const users = require('../DAO/users')

// Crea una instancia de NodeCache
const sessionCache = new NodeCache();

// Middleware para manejar las cookies
router.use(cookieParser());

// Ruta de inicio
router.get('/', async(req, res) => {
  // Verificar si la cookie de sesión existe
  const sessionId = req.cookies.sessionId;
  const email = sessionId;
  let user = req.cookies.user;
  if (sessionId && user == undefined) {
    try {
      user = await users.getUserByEmail(email);
      user = user[0]
      res.cookie('user', user, { httpOnly: true, maxAge: 60*60*90*60});  
    } catch (error) {
      console.log(error)
    }
    
  }
  
  if (sessionId && user !== undefined) {
    // La sesión está activa, obtener los datos de la sesión
    
    
    console.log("Hay sesión");
    console.log("Email:", email);
    console.log("USER:", user);
    
    let next = "/";
    switch(user.role_name){
      case 'Front':
        next = "agent/index";
      break;
      case 'Premium':
        next = "agent/index";
        break;
      case 'Coordinador':
        next = 'coordinator/index'
      break;
      case 'Administrador':
        next = 'admin/index'
      break;
      default:
        next = '401'
      break;
    }
    
    
    res.render(next, { title: 'Base de Conocimiento', req , user : user });
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
router.use('/files', require('./files'));
router.use('/admin', require('./admin'));
router.use('/comments', require('./comments'));




module.exports = router;
