const express = require('express');
const router = express.Router();

// Ruta de inicio de sesión
router.get('/login', (req, res) => {
  // Lógica para mostrar la página de inicio de sesión
  console.log("login")
  res.render('auth/login', { title: 'Login', req });
});

router.post('/login', (req,res) => {
    
    
    let response = {
        status : "success",
        message : "Login succesfully"
    }
    res.render('auth')

})

// Ruta de registro
router.get('/register', (req, res) => {
  // Lógica para mostrar la página de registro
});

// Ruta de cierre de sesión
router.get('/logout', (req, res) => {
  // Lógica para cerrar sesión del usuario
});

module.exports = router;
