const express = require('express');
const router = express.Router();
const articles = require("../DAO/articles");
const resources = require("../DAO/resources")
// Ruta de cierre de sesión
router.get('/', async(req, res) => {
  // Lógica para cerrar sesión del usuario
  //console.log("dashboard admin")
  let items = await articles.listArticles();
  //console.log(items)
  
  res.render('articles/index', { title: 'Articles', articles: items, req });
});

router.get('/guide/new', async (req, res) => {
  // Lógica para cerrar sesión del usuario
  //console.log("guide")


  res.render('guides/new', { title: 'Guides', req });
});


router.get('/resources/new', async (req, res) => {
  // Lógica para cerrar sesión del usuario
  

  let categories = await resources.listCategories();
  res.render('resources/new', { title: 'Resources', categories: categories, req });
});


router.get('/news/new', async (req, res) => {
  // Lógica para cerrar sesión del usuario
  


  res.render('news/new', { title: 'News',  req });
});





router.get('/article/new', async (req, res) => {
  // Lógica para cerrar sesión del usuario
  //console.log("article")


  res.render('articles/new', { title: 'Articles', req });
});



router.post('/', (req, res) => {
  // Lógica para cerrar sesión del usuario
  //console.log("articles")
  res.response("test")  
});


router.get('/:id', async(req, res) => {
  // Lógica para cerrar sesión del usuario
  //console.log("article:", req.params.id)
  let article = await articles.getArticle(req.params.id)
  
  res.render('articles/article', { title: article.title,  article: article, req });
});


router.put('/:id', (req, res) => {
  // Lógica para cerrar sesión del usuario
  //console.log("article")
  res.render('articles/article', { title: 'Articles', req });
});
router.delete('/:id', (req, res) => {
  // Lógica para cerrar sesión del usuario
  //console.log("article")
  res.render('articles/article', { title: 'Articles', req });
});


module.exports = router;
