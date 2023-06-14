const express = require('express');
const nunjucks = require('nunjucks');
const app = express();
const port = 3000;
app.locals.baseUrl = 'http://localhost:3000'; // Reemplaza con la URL base de tu aplicación

// Configurar el motor de plantillas Nunjucks
app.use('/assets', express.static('assets'));

app.set('view engine', 'njk');
nunjucks.configure('views', {
  autoescape: true,
  express: app
});

// Rutas
app.get('/', (req, res) => {
  res.render('index', { title: 'Base de Conocimiento', req }); // Renderizar la vista index.njk y pasar el objeto req como contexto
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
