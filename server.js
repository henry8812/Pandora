const express = require('express');
const nunjucks = require('nunjucks');
const app = express();
const port = 3000;

// Configurar el motor de plantillas Nunjucks
app.set('view engine', 'njk');
nunjucks.configure('views', {
  autoescape: true,
  express: app
});

// Rutas
app.get('/', (req, res) => {
  res.render('index', { title: 'Base de Conocimiento' }); // Renderizar la vista index.njk
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
