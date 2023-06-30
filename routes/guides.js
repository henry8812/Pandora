const express = require('express');
const router = express.Router();
const guides = require("../DAO/guides");
// Ruta de cierre de sesión
router.get('/', async(req, res) => {
  // Lógica para cerrar sesión del usuario
  console.log("guides")
  let items = await guides.listGuides();
  console.log(items)
  
  res.render('guides/index', { title: 'Articles', guides: items, req });
});

router.get('/new', async (req, res) => {
  // Lógica para cerrar sesión del usuario
  


  res.render('guides/index', { title: 'Guides', req });
});

router.post('/', (req, res) => {
  // Lógica para cerrar sesión del usuario
  console.log("guides")
  res.response("test")  
});


router.get('/:id', async(req, res) => {
  // Lógica para cerrar sesión del usuario
  console.log("article:", req.params.id)
  let guide = await guides.getGuide(req.params.id)
  
  res.render('guides/guide', { title: guide.title,  guide: guide, req });
});

router.put('/:id', (req, res) => {
  // Lógica para cerrar sesión del usuario
  console.log("guide")
  res.render('guides/guide', { title: 'Articles', req });
});
router.delete('/:id', (req, res) => {
  // Lógica para cerrar sesión del usuario
  console.log("article")
  res.render('articles/article', { title: 'Articles', req });
});


module.exports = router;
