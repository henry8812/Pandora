const express = require('express');
const router = express.Router();
const articles = require("../DAO/articles");
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const NodeCache = require('node-cache');
const { Console } = require('console');
const users = require('../DAO/users'); // Importa el módulo users
const xapi = require('../DAO/xapi'); // Importa el módulo xapi

router.use(fileUpload());

router.get('/', async (req, res) => {
  try {
    const items = await articles.listArticles();
    const sessionId = req.cookies.sessionId;
    const email = sessionId;
    let author = email;
    let user = await users.getUserByEmail(email);
    
    // Registra el acceso en xapi_logs
    const event_type = 'articles_listed';
    const action = 'Listed articles'; // Detalles de la acción realizada
    const extra_info = {
      total_articles: items.length,
      article_ids: items.map(item => item.id),
      user_email: user.email,
      user_id: user.id,
      timestamp: new Date().toISOString()
    };    
    await xapi.createXAPILog(event_type, action, JSON.stringify(extra_info), req);
    
    res.render('articles/index', { title: 'Articles', articles: items, user: user, req });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving articles');
  }
});

router.get('/new', async (req, res) => {
  try {
    
    // Registra el acceso en xapi_logs
    const sessionId = req.cookies.sessionId;
    const email = sessionId;
    let user = await users.getUserByEmail(email);
    const event_type = 'ARTICLE CREATION FORM OPENED';
    const action = 'ARTICLE CREATION OPENED'; // Detalles de la acción realizada
    const extra_info = {
      
      user_email: user.email,
      user_id: user.id,
      timestamp: new Date().toISOString()
    };    
    await xapi.createXAPILog(event_type, action, JSON.stringify(extra_info), req);
    res.render('articles/new', { title: 'New Article', req });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving new article form');
  }
});

router.post('/', async (req, res) => {
  try {
    console.log(req.body)
    const { title, bannerurl, shortDescription, content, target_id } = req.body;
    
    if (!title || !shortDescription ) {
      return res.status(400).send('Missing required fields');
    }
    
    
    const sessionId = req.cookies.sessionId;
    const email = sessionId;
    let author = email
    
    const articleData = {
      title,
      banner: bannerurl || '',
      shortDescription,
      content: content || '',
      creator : author,
      target_id
    };
    
    await articles.createArticle(articleData);
    let response = {
      status: "success",
      message: "article created succesfully",
      data: articleData
    };  
    
    // Registra el acceso en xapi_logs
    
    let user = await users.getUserByEmail(email);
    const event_type = 'ARTICLE CREATED';
    const action = 'NEW ARTICLE HAS BEEN CREATED'; // Detalles de la acción realizada
    const extra_info = {
      article: articleData,
      user_email: user.email,
      user_id: user.id,
      timestamp: new Date().toISOString()
    };    
    await xapi.createXAPILog(event_type, action, JSON.stringify(extra_info), req);
    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating article');
  }
});

async function downloadImage(url, imagePath) {
  const response = await axios.get(url, { responseType: 'stream' });
  
  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(imagePath);
    response.data.pipe(writer);
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

router.get('/:id', async (req, res) => {
  try {
    const article = await articles.getArticle(req.params.id);
    
    // Registra el acceso en xapi_logs
    const sessionId = req.cookies.sessionId;
    const email = sessionId;

    let user = await users.getUserByEmail(email);
    const event_type = 'ARTICLE OPENED';
    const action = `ARTICLE HAS BEEN OPENED BY ${user.id}`; // Detalles de la acción realizada
    const extra_info = {
      article: article,
      user_email: user.email,
      user_id: user.id,
      timestamp: new Date().toISOString()
    };    
    await xapi.createXAPILog(event_type, action, JSON.stringify(extra_info), req);
    res.render('articles/article', { title: article.title, article: article, req });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving article');
  }
});

router.get('/:id/edit', async (req, res) => {
  try {
    const article = await articles.getArticle(req.params.id);
    res.render('articles/edit', { title: 'Edit Article', article: article, req });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving article');
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, bannerurl, shortDescription, content } = req.body;
    
    const articleData = {
      title,
      bannerurl,
      shortDescription,
      content,
    };
    
    await articles.updateArticle(req.params.id, articleData);
    
    res.redirect(`/articles/${req.params.id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating article');
  }
});

router.post('/delete/:id', async (req, res) => {
  try {
    const sessionId = req.cookies.sessionId;
    const email = sessionId;
    console.log("delete")

    let user = await users.getUserByEmail(email);
  
    await articles.deleteArticle(req.params.id);
    const event_type = 'ARTICLE DELETED';
    const action = `ARTICLE HAS BEEN DELETED BY ${user.id}`; // Detalles de la acción realizada
    const extra_info = {
      article_id: req.params.id,
      user_email: user.email,
      user_id: user.id,
      timestamp: new Date().toISOString()
    };    
    await xapi.createXAPILog(event_type, action, JSON.stringify(extra_info), req);
    res.send({
      id : req.params.id
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting article');
  }
});



router.post('/uploadBanner', async (req, res) => {
  try {
    if (!req.files || !req.files.banner) {
      return res.status(400).send('No banner image provided');
    }
    
    const banner = req.files.banner;
    
    
    // Generar un nombre único para el archivo
    let ext = banner.name.substr(banner.name.length - 4, banner.name.length)
    
    const fileName = `${uuidv4()}`+ext;
    
    // Ruta de destino para guardar la imagen
    const imagePath = path.join(__dirname, '../assets/images/uploads', fileName);
    
    // Cargar la imagen en el directorio de destino utilizando fs
    fs.writeFileSync(imagePath, banner.data);
    
    // Ruta de la imagen cargada en la carpeta /assets/images/uploads
    const bannerPath = `/assets/images/uploads/${fileName}`;
    
    res.json({ imagePath: bannerPath });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading banner image');
  }
});




module.exports = router;
