const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const NodeCache = require('node-cache');
const db = require('../DAO/db');
const auth = require("../DAO/auth");
const users = require("../DAO/users");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Crea una instancia de NodeCache
const sessionCache = new NodeCache();

// Ruta de inicio de sesión
router.get('/login', (req, res) => {
  // Lógica para mostrar la página de inicio de sesión
  res.render('auth/login', { title: 'Login', req });
});

router.get('/change-password',async (req, res) => {
  // Lógica para mostrar la página de inicio de sesión
  const sessionId = req.cookies.sessionId;
  const email = sessionId;
  let author = email

  let user = await users.getUserByEmail(author);
  res.render('auth/change-password', { title: 'Change Password', user : user, req });
});

router.post('/change-password',async (req, res) => {

  console.log(JSON.stringify(req.body, null,  4))
  let response = await auth.changePassword(req.body.userId, req.body.newPassword)
  console.log(response)
  res.send(response)
})





router.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  let resp = await auth.authenticateUser(email, password);

  if (resp === null) {
    let response = {
      status: "failed",
      message: "Email and Password combination are incorrect"
    };
    res.send(response);
  } else {
    // Eliminar el campo "password" del objeto resp
    delete resp[0].password;

    try {
      const user = await users.getUserByEmail(email);
      const accessLogs = await auth.getAccessLogsByUserId(user.id);

      console.log(accessLogs)
      let next = ''
      if (accessLogs.length === 1) {
        next = '/auth/change-password';
        
      }

      res.cookie('user', user, { httpOnly: true, maxAge: 60 * 60 * 90 * 60 });
      res.cookie('sessionId', email, { httpOnly: true, maxAge: 60 * 60 * 90 * 60 });

      let response = {
        status: "success",
        message: "Login successfully",
        next : next,
        data: resp[0]
      };
      res.send(response);
    } catch (error) {
      console.log(error);
    }
  }
});

// Ruta de registro
router.get('/register', (req, res) => {
  // Lógica para mostrar la página de registro
});

// Ruta de cierre de sesión
router.get('/logout', (req, res) => {
  // Lógica para cerrar sesión del usuario
  res.clearCookie('sessionId');
  res.redirect('/auth/login');
});

// Función para generar un identificador único para la sesión
function generateSessionId() {
  return Math.floor(Math.random() * 100000) + 1;
}



module.exports = router;
