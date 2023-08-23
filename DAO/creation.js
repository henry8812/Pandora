const bcrypt = require('bcrypt');
const fs = require('fs');
const parse = require('csv-parse');
const nodemailer = require('nodemailer');
const db = require('./db');
const dotenv = require('dotenv');

dotenv.config();

// Configuración de correo
const emailConfig = {
  service: 'outlook',
  auth: {
    user: 'hagomez@emcali.com.co',
    pass: 'Swordfish3842',
  },
};

// Función para autenticar al usuario
async function authenticateUser(email, password) {
  try {
    const query = 'SELECT * FROM users WHERE email = ?';
    const values = [email];
    const user = await db.query(query, values);

    if (user[0]) {
      const passwordMatch = await comparePassword(password, user[0].password);

      if (passwordMatch) {
        // Usuario autenticado
        console.log('User Authenticated');
        return user;
      } else {
        // Contraseña incorrecta
        console.log('Incorrect Password');
        return null;
      }
    } else {
      // Usuario no encontrado
      console.log('User not found');
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Función para comparar contraseñas
async function comparePassword(password, hashedPassword) {
  const passwordMatch = await bcrypt.compare(password, hashedPassword);
  return passwordMatch;
}

// Función para encriptar una contraseña
async function encryptPassword(password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
}

// Función para crear un nuevo usuario con contraseña aleatoria
async function createRandomPasswordUser(name, email, role) {
  try {
    const randomPassword = generateRandomPassword();
    const hashedPassword = await encryptPassword(randomPassword);

    const query = 'INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)';
    const values = [name, email, hashedPassword, role];
    const result = await db.query(query, values);

    if (result.affectedRows === 1) {
      console.log('User created successfully');
      sendEmail(email, 'Bienvenido a Pandora', `Has sido creado como usuario en Pandora. Para conocer más, puedes comunicarte con tu coordinador de calidad e ingresar http://172.19.20.140:3000/ usando tu correo y esta contraseña: ${randomPassword}`);
      return result.insertId;
    } else {
      console.log('Failed to create user');
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Generar contraseña aleatoria
function generateRandomPassword() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 10;
  let randomPassword = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomPassword += characters.charAt(randomIndex);
  }

  return randomPassword;
}

// Enviar correo electrónico
async function sendEmail(to, subject, text) {
  const transporter = nodemailer.createTransport(emailConfig);

  const mailOptions = {
    from: 'hagomez@emcali.com.co',
    to: to,
    subject: subject,
    text: text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

// Función para leer el archivo CSV y crear usuarios
async function readCSVAndCreateUsers(filePath) {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');

      const rows = fileContent.split('\n').slice(1); // Elimina la primera fila (encabezados)
  
      for (const row of rows) {
        const [name, email, role] = row.split(',');
        console.log(row)
        try {
          const userId = await createRandomPasswordUser(name, email, role);
          if (userId !== null) {
            console.log(`Usuario creado con ID: ${userId}`);
          }
        } catch (error) {
          console.error('Error al crear usuario:', error);
        }
      }
    } catch (error) {
      console.error('Error al leer el archivo:', error);
    }
  }

// Llamada a la función para leer el archivo CSV y crear usuarios
readCSVAndCreateUsers('./files/users.csv');
