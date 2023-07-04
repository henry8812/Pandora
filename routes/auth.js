const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
const NodeCache = require('node-cache');
const auth = require("../DAO/auth");
const users= require("../DAO/users")

// Crea una instancia de NodeCache
const sessionCache = new NodeCache();

// Ruta de inicio de sesión
router.get('/login',  (req, res) => {
  // Lógica para mostrar la página de inicio de sesión
  console.log("login");
  res.render('auth/login', { title: 'Login', req });
});

router.post('/login',async (req, res) => {
  // Acceder a los datos del cuerpo de la solicitud POST
  let user = null;
  const email = req.body.email;
  const password = req.body.password;
  let resp = await auth.authenticateUser(email, password)
  
  if(resp === null) {
    let response = {
      status: "failed",
      message: "Email and Password combination are incorrect"
    };  
    res.send(response);
  } else {
    // Eliminar el campo "password" del objeto resp
    console.log(user)
    console.log("user after")
    delete resp[0].password;
    try {
      console.log(email)
      user = await users.getUserByEmail(email);
      console.log("after queery")
      console.log(user)
      
      res.cookie('user', user, { httpOnly: true, maxAge: 60*60*90*60});  
      
      console.log("just")
      console.log(user)
    } catch (error) {
      console.log(error)
    }
    
    res.cookie('sessionId', email, { httpOnly: true, maxAge: 60*60*90*60});

    let response = {
      status: "success",
      message: "Login successfully",
      data: resp[0]
    };  
    res.send(response);
  }
  
  
});
// Ruta de registro
router.get('/register', (req, res) => {
  // Lógica para mostrar la página de registro
});

// Ruta de cierre de sesión
router.get('/logout', (req, res) => {
  // Lógica para cerrar sesión del usuario
  // Borrar la cookie de sesión
  res.clearCookie('sessionId');
  
  // Redirigir al usuario a la página de inicio de sesión
  res.redirect('/auth/login');
});

// Función para generar un identificador único para la sesión
function generateSessionId() {
  // Aquí puedes implementar tu lógica para generar un identificador único
  // Puede ser un token aleatorio, un UUID, un hash, etc.
  // En este ejemplo, simplemente se genera un número aleatorio entre 1 y 100000
  return Math.floor(Math.random() * 100000) + 1;
}

module.exports = router;
