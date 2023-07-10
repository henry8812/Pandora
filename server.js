const express = require('express');
const nunjucks = require('nunjucks');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const cookieParser = require('cookie-parser');
const authMiddleware = require('./authMiddleware'); // Ruta al archivo del middleware

const app = express();
const port = 3000;

// Configurar el motor de plantillas Nunjucks
app.set('view engine', 'njk');
const njkEnv = nunjucks.configure('views', {
  autoescape: true,
  express: app
});

// Middlewares
app.use(cookieParser());
app.use(session({
  secret: 'sec6u88(%1_-poqwy',
  resave: false,
  saveUninitialized: false,
  store: new MemoryStore({
    checkPeriod: 600
  })
}));
app.use(express.json());

app.use(authMiddleware);

// Configuración adicional de Nunjucks
njkEnv.addFilter('date', function(value, format) {
  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };
  return value.toLocaleString('en-US', options);
});
njkEnv.addFilter('renderHtml', function (value) {
  return new nunjucks.runtime.SafeString(value);
});

// Configuración de rutas
app.use('/assets', express.static('assets'));

app.use('/', function(req, res, next) {
  njkEnv.addGlobal('req', req);
  res.locals.currentPath = req.path;
  next();
});

const indexRouter = require('./routes/index');
app.use('/', indexRouter);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
