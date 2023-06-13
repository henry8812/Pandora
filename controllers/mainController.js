const express = require('express');
const router = express.Router();

// Controlador principal
router.get('/', (req, res) => {
  // Lógica del controlador para la ruta '/'
  res.render('index');
});

module.exports = router;
