const express = require('express');
const router = express.Router();

// Ruta de cierre de sesión
router.get('/users', (req, res) => {
  // Lógica para cerrar sesión del usuario
  console.log("users")
});
module.exports = router;
