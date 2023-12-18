const express = require('express');
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
const comments = require('../DAO/comments');
const nodemailer = require('nodemailer'); // Importa nodemailer
const users = require('../DAO/users')
const https = require('https');

var emailParams = {
  name: 'James',
  notes: 'Check this out!'
};


// Configura el transporte de correo
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user: 'hagomez@emcali.com.co',
    pass: 'Swordfish3842',
  },
  secure: true, // Cambia secure a true
  port: 465, // Cambia el puerto a 587
});


router.post('/', async (req, res) => {
  // Lógica para cerrar sesión del usuario
  console.log(JSON.stringify(req.body, null, 4));
  const { object_id, comment, rating, object_type } = req.body;
  const sessionId = req.cookies.sessionId;
  const email = sessionId;
  let author = email;
  let user = await users.getUserByEmail(email)
  emailParams.name = user.name;
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
  const http = require('https');

const options = {
	method: 'POST',
	hostname: 'emailjs.p.rapidapi.com',
	port: null,
	path: '/api/v1.0/email/send',
	headers: {
		'content-type': 'application/json',
		'X-RapidAPI-Key': 'c304b39e34mshc35c07e6e8d3491p11ff67jsn60d5ffdfede0',
		'X-RapidAPI-Host': 'emailjs.p.rapidapi.com'
	}
};

const request = http.request(options, function (resp) {
	const chunks = [];

	resp.on('data', function (chunk) {
		chunks.push(chunk);
	});

	resp.on('end', function () {
		const body = Buffer.concat(chunks);
		console.log(body.toString());
	});
});
function stripHtmlTags(html) {
  // Utiliza una expresión regular para eliminar las etiquetas HTML
  return html.replace(/<[^>]*>/g, '');
}
request.write(JSON.stringify({
  accessToken: '2Ja3msxVWUA5pzf1fiARe',
  service_id: 'service_noa2i0o',
  template_id: 'template_hdf4zie',
  user_id: '4Aiq4PEyKP6jBz-T1',
  template_params: {
    username: 'henry',
    message: `El usuario ${author} ha comentado lo siguiente: "${stripHtmlTags(comment)}",  puedes verlo en el siguiente enlace ${base_dir}${BASE[object_type]}${object_id}`
  }
}));
request.end();
  /**
  emailParams.message =  `El usuario ${author} ha comentado lo siguiente: ${commentLink} en el ${link}`;
  emailObject.send("service_noa2i0o","template_hdf4zie",emailParams, '4Aiq4PEyKP6jBz-T1')
  .then( info => {
    console.log('Correo electrónico enviado:', info.response);
  }, error => {
    console.log('Error al enviar el correo:', error);
  })*/
  
  
  
  
  
  
  res.send({
    status: 'success',
  });
});

module.exports = router;
