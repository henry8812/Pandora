const express = require('express');
const nunjucks = require('nunjucks');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');

const app = express();
const port = 3000;

// Configurar el motor de plantillas Nunjucks
app.use('/assets', express.static('assets'));

app.set('view engine', 'njk');
nunjucks.configure('views', {
  autoescape: true,
  express: app
});

// Configurar las sesiones
/**
app.use(session({
  secret: 'sec6u88(%1_-poqwy', // Cambia esto por una clave secreta más segura
  resave: false,
  saveUninitialized: false,
}));


// Configurar Passport.js
require('./config/passport')(passport);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
*/
// Importar las rutas
const indexRouter = require('./routes/index');

// Rutas
app.use('/', indexRouter);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
