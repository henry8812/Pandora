const express = require('express');
const router = express.Router();
const search = require('../DAO/search');
const cookieParser = require('cookie-parser');
const NodeCache = require('node-cache');

router.use(express.urlencoded({ extended: true }));

router.get('/', async (req, res) => {
  console.log(req.query); // Utilizamos req.query para obtener los parámetros de la consulta
  
  const criteria = req.query.criteria;
  const category = req.query.category;
  
  let data = {
    'articles': [],
    'guides': [],
    'resources': []
  };

  switch (category) {
    case 'all':
      data.articles = await search.searchArticles(criteria);
      data.guides = await search.searchGuides(criteria);
      data.resources = await search.searchResources(criteria);
      break;
    case 'articles':
      data.articles = await search.searchArticles(criteria);
      break;
    case 'resources':
      data.resources = await search.searchResources(criteria);
      break;
    case 'guides': // Corregido el typo "gudes" a "guides"
      data.guides = await search.searchGuides(criteria);
      break;
    default:
      data.articles = await search.searchArticles(criteria);
      data.guides = await search.searchGuides(criteria);
      data.resources = await search.searchResources(criteria);
      break;
  }

  console.log(data);
  res.render('search/index', { title: 'Search', data: data, req });
});

module.exports = router;
