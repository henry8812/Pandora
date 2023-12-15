const express = require('express');
const router = express.Router();
const articles = require("../DAO/articles");
const resources = require("../DAO/resources")
const guides = require('../DAO/guides')
const cookieParser = require('cookie-parser');
const NodeCache = require('node-cache');
const { Console } = require('console');
const users = require('../DAO/users'); // Importa el módulo users

router.get('/articles', async(req, res) => {
    // Lógica para cerrar sesión del usuario
    console.log("articles")
    let items = await articles.listFrontArticles();
    console.log(items)
    const sessionId = req.cookies.sessionId;
    const email = sessionId;
    let author = email;
    let user = await users.getUserByEmail(email);
    
    res.render('articles/index', { title: 'Articles', articles: items, user:user, req });
  });

  router.get('/guides', async(req, res) => {
    // Lógica para cerrar sesión del usuario
    console.log("guides")
    let items = await guides.listFrontGuides();
    console.log(items)
    const sessionId = req.cookies.sessionId;
    const email = sessionId;
    let author = email;
    let user = await users.getUserByEmail(email);
    
    res.render('guides/index', { title: 'Articles', guides: items, user: user, req });
  });


  module.exports = router;
