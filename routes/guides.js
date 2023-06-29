const express = require('express');
const router = express.Router();
const articles = require("../DAO/articles");
// Ruta de cierre de sesión
router.get('/', async(req, res) => {
  // Lógica para cerrar sesión del usuario
  console.log("articles")
  let items = await articles.listArticles();
  console.log(items)
  
  res.render('articles/index', { title: 'Articles', articles: items, req });
});

router.get('/new', async (req, res) => {
  // Lógica para cerrar sesión del usuario
  console.log("article")


  res.render('articles/index', { title: 'Articles', req });
});

router.post('/', (req, res) => {
  // Lógica para cerrar sesión del usuario
  console.log("articles")
  res.response("test")  
});


router.get('/:id', async(req, res) => {
  // Lógica para cerrar sesión del usuario
  console.log("article:", req.params.id)
  let article = await articles.getArticle(req.params.id)
  
  res.render('articles/article', { title: article.title,  article: article, req });
});

router.put('/:id', (req, res) => {
  // Lógica para cerrar sesión del usuario
  console.log("article")
  res.render('articles/article', { title: 'Articles', req });
});
router.delete('/:id', (req, res) => {
  // Lógica para cerrar sesión del usuario
  console.log("article")
  res.render('articles/article', { title: 'Articles', req });
});


module.exports = router;
