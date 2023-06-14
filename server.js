const express = require('express');
const nunjucks = require('nunjucks');
const app = express();
const port = 3000;

// Configurar el motor de plantillas Nunjucks
app.use('/assets', express.static('assets'));

app.set('view engine', 'njk');
nunjucks.configure('views', {
  autoescape: true,
  express: app
});

// Importar las rutas
const indexRouter = require('./routes/index');

// Rutas
app.use('/', indexRouter);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
