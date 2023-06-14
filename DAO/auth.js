const bcrypt = require('bcrypt');
const db = require('./db');

// Función para autenticar al usuario
async function authenticateUser(username, password) {
  try {
    const query = `SELECT * FROM users WHERE username = ?`;
    const values = [username];
    const [rows, fields] = await db.promise().query(query, values);

    if (rows.length === 1) {
      const user = rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        // Usuario autenticado
        return user;
      } else {
        // Contraseña incorrecta
        return null;
      }
    } else {
      // Usuario no encontrado
      return null;
    }
  } catch (error) {
    throw error;
  }
}

// Función para encriptar una contraseña
async function encryptPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

module.exports = {
  authenticateUser,
  encryptPassword
};
