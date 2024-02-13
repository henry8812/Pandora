const express = require('express');
const router = express.Router();
const resources = require("../DAO/resources");
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const NodeCache = require('node-cache');
const { Console } = require('console');
const users = require('../DAO/users'); // Importa el módulo users
router.use(fileUpload());
// Ruta de cierre de sesión
router.get('/', async(req, res) => {
  // Lógica para cerrar sesión del usuario
  //console.log("resources")
  let items = await resources.listResources();
  //console.log(items)
  
  let categories = await resources.listCategories();
  const sessionId = req.cookies.sessionId;
  const email = sessionId;
  let author = email;
  let user = await users.getUserByEmail(email);
  res.render('resources/index', { title: 'Resources', resources: items,  categories: categories, user: user, req });
});


router.post('/', async (req, res) => {
  
  try {
    /**
     * Start file creation
     */
    //console.log(Object.keys(req))
    if (!req.files || !req.files.file) {
      //console.log(req.files)
      return res.status(400).send('No file provided');
    }

    const file = req.files.file;
    const filePath = path.join(__dirname, '../files', file.name);
    fs.writeFileSync(filePath, file.data);
    
    const fileData = {
      filename : file.name,
      path : file.name
    };
    let response = await resources.createFile(fileData)
    //console.log(response)
    /**
     * END file creation
     */
    /***
     * Start Resource Creation
     */
    let resourceData = {
      title : fileData.filename,
      description : fileData.filename,
      file_id : response.id,
      category_id : req.body.category || 3,
      resource : req.body.resource || 0
    }
    //console.log(resourceData)

    let resource = resources.createResource(resourceData);
    resource.file = fileData
    
    /**
     * END Resource creation
     */


    res.json({ resource : resource });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading resource file');
  }
});

router.get('/:id', async(req, res) => {
  res.send("test")  
});

router.put('/:id', (req, res) => {
  
  res.response("test")  
});
router.delete('/:id', (req, res) => {
  //console.log(req.params.id)

  resources.deleteResource(req.params.id)
  res.send("deleted")  
});


module.exports = router;
