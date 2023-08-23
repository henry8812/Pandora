const express = require('express');
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
const comments = require('../DAO/comments');
const nodemailer = require('nodemailer'); // Importa nodemailer
const users = require('../DAO/users')

// Configura el transporte de correo
const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: 'hagomez@emcali.com.co',
    pass: 'Swordfish3842',
  },
});

router.post('/', async (req, res) => {
  // Lógica para cerrar sesión del usuario
  console.log(JSON.stringify(req.body, null, 4));
  const { object_id, comment, rating, object_type } = req.body;
  const sessionId = req.cookies.sessionId;
  const email = sessionId;
  let author = email;
  let user = await users.getUserByEmail(email)
  console.log(object_id);
  console.log(comment);
  console.log(rating);
  console.log(object_type);
  const commentData = {
    object_id,
    author,
    comment,
    object_type,
  };

  let response = await comments.createComment(commentData);
  let rating_value = rating || 0;
  let ratingData = {
    object_id,
    object_type,
    author,
    rating_value,
  };
  let OBJECTS = {
    1:  "PROCEDIMIENTO",
    2:  "MANUAL",
    3:  "RECURSO"
  }
  let BASE = {
    1 : "guides/",
    3 : "articles/",
    4 : "resources/"
  }
  let base_dir = 'http://172.19.20.140:3000/'

  rating_response = await comments.rateContent(ratingData);
  console.log(response);



  const commentLink = `${comment}`;
  const link = `<a href="${base_dir}${BASE[object_type]}${object_id}">Enlace</a>`;
  // Envía el correo electrónico
  const mailOptions = {
    from: '"bc-pandora" <hagomez@emcali.com.co>', // Nombre y dirección de origen personalizados
    to: 'hacastillo@emcali.com.co', // Destinatario
    subject: 'Nuevo comentario',
    html: `El usuario ${author} ha comentado lo siguiente: ${commentLink} en el ${link}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error al enviar el correo:', error);
    } else {
      console.log('Correo electrónico enviado:', info.response);
    }
  });

  res.send({
    status: 'success',
  });
});

module.exports = router;
