const express = require('express');
const cookieParser = require('cookie-parser');
const router = express.Router();
const NodeCache = require('node-cache');
const users = require('../DAO/users')
const _news = require('../DAO/news')
const _articles = require('../DAO/articles')


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
    let news = null;
    let articles = null;
    switch(user.role_name){
      case 'Front':
        next = "agent/index";
        news = await _news.listNews()

        articles = await _articles.listPopularArticles();
        
      break;

      case 'Premium':
        next = "agent/index";
        news = await _news.listNews()
        articles = await _articles.listPopularArticles();
        break;
      case 'Operativo':
        next = "agent/index";
        news = await _news.listNews()
        
        articles = await _articles.listPopularArticles();
      break;
      case 'Herramientas de Gestion':
        next = "agent/index";
        news = await _news.listNews()
        
        articles = await _articles.listPopularArticles();
      break;
      
      
      case 'Coordinador':
        next = 'coordinator/index'
        articles = await _articles.listPopularArticles();
      break;
      case 'Administrador':
        next = 'admin/index'
        articles = await _articles.listPopularArticles();
      break;
      default:
        next = '401'
      break;
    }
    
    console.log(JSON.stringify(news, null, 4))
    res.render(next, { title: 'Base de Conocimiento', req , user : user, news : news, articles : articles });
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
router.use('/front', require('./front'));

router.use('/premium', require('./premium'));
router.use('/ops', require('./ops'));
router.use('/tools', require('./tools'));


router.use('/comments', require('./comments.js'));

router.use('/news', require('./news.js'));
router.use('/search', require('./search.js'));
router.use('/reports', require('./reports.js'));






module.exports = router;
