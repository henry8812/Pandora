const express = require('express');
const nunjucks = require('nunjucks');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const cookieParser = require('cookie-parser');
const authMiddleware = require('./authMiddleware'); // Ruta al archivo del middleware
const filters = require('./filters'); // Ruta al archivo filters.js que contiene los filtros personalizados

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
njkEnv.addFilter('truncateText', function(value, maxLength) {
  if (value.length <= maxLength) {
    return value;
  } else {
    return value.slice(0, maxLength) + '...';
  }
});
// Configuración adicional de Nunjucks
njkEnv.addFilter('date', function(value, format) {
  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };
  return value.toLocaleString('en-US', options);
});
njkEnv.addFilter('groupby', function (collection, key) {
  const groups = {};
  collection.forEach(function (item) {
    const groupKey = item[key];
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
  });
  console.log(groups)
  return groups;
});
njkEnv.addFilter('renderHtml', function (value) {
  return new nunjucks.runtime.SafeString(value);
});
njkEnv.addFilter('renderStars', filters.renderStars);

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
