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
  try {
    res.render('guides/new', { title: 'New Guide', req });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving new guide form');
  }
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

router.post('/', async (req, res) => {
  try {
    console.log(req.body)
    const { title, documenturl, shortDescription, content } = req.body;

    if (!title || !shortDescription || !content) {
      return res.status(400).send('Missing required fields');
    }

    
    const sessionId = req.cookies.sessionId;
    const email = sessionId;
    let author = email
    const guideData = {
      title,
      document: documenturl,
      shortDescription,
      content,
      creator : author
    };

    await guides.createGuide(guideData);
    let response = {
      status: "success",
      message: "article created succesfully",
      data: articleData
    };  
    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating article');
  }
});
router.post('/uploadDocument', async (req, res) => {
  try {
    if (!req.files || !req.files.document) {
      return res.status(400).send('No document provided');
    }

    const document = req.files.document;

    // Generar un nombre único para el archivo
    

    // Ruta de destino para guardar la imagen
    const imagePath = path.join(__dirname, '../files/uploads', document.fileName);

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
