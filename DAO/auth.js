const bcrypt = require('bcrypt');
const db = require('./db');
const dotenv = require('dotenv');

dotenv.config();

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

module.exports = {
  authenticateUser,
  encryptPassword,
};
