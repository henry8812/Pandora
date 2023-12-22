const express = require('express');
const router = express.Router();
const articles = require("../DAO/articles");
const resources = require("../DAO/resources")
const guides = require('../DAO/guides')
const cookieParser = require('cookie-parser');
const NodeCache = require('node-cache');
const { Console } = require('console');
const users = require('../DAO/users'); // Importa el módulo users
const tools = require('../DAO/tools');

router.get('/articles', async(req, res) => {
    // Lógica para cerrar sesión del usuario
    console.log("articles")
    let items = await articles.listToolsArticles();
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
    let items = await guides.listToolsGuides();
    console.log(items)
    const sessionId = req.cookies.sessionId;
    const email = sessionId;
    let author = email;
    let user = await users.getUserByEmail(email);
    res.render('guides/index', { title: 'Articles', guides: items, user:user, req });
  });

  router.get('/form', async(req, res) => {
    // Lógica para cerrar sesión del usuario
    //TODO: consultar la informacion necesaria para las consultas de base de datos.
    const sessionId = req.cookies.sessionId;
    const email = sessionId;
    let author = email;
    let user = await users.getUserByEmail(email);
    let date = new Date()
    res.render('tools/form', { title: 'Maintenance', user:user, date :date.toLocaleDateString(), req });
  });

  router.get('/query/:username', async(req,res) => {
    let employee = await tools.getEmployee(req.params.username)
    res.send({
      status: 'success',
      employee : employee,
      equipment : [
        {
          id: 1,
          sn : "xxxxxx",
          ram: "xx",
          hd : "xx",
          name : "xx",
          model :"zxx",
          brand: "xxx",
          type : "Desktop",
          peripherical : {            
            display : { sn: "x", model :"xx", brand : "xxx"},
            mouse :  { sn: "x", model :"xx", brand : "xxx"},
            keyboard:  { sn: "x", model :"xx", brand : "xxx"},

          }
        }
      ]
    });
  })

  module.exports = router;
