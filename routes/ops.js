const express = require('express');
const router = express.Router();
const articles = require("../DAO/articles");
const resources = require("../DAO/resources")
const guides = require('../DAO/guides')

router.get('/articles', async(req, res) => {
    // Lógica para cerrar sesión del usuario
    console.log("articles")
    let items = await articles.listOpsArticles();
    console.log(items)
    
    res.render('articles/index', { title: 'Articles', articles: items, req });
  });

  router.get('/guides', async(req, res) => {
    // Lógica para cerrar sesión del usuario
    console.log("guides")
    let items = await guides.listOpsGuides();
    console.log(items)
    
    res.render('guides/index', { title: 'Articles', guides: items, req });
  });


  module.exports = router;
