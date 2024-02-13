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
        // Registrar el acceso en la tabla de registros de acceso
        await recordAccess(user[0].id);

        //console.log('User Authenticated');
        return user;
      } else {
        // Contraseña incorrecta
        //console.log('Incorrect Password');
        //console.log('Authentication Failed for '+email)
        return null;
      }
    } else {
      // Usuario no encontrado
      //console.log('User not found');
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
async function recordAccess(userId) {
  try {
    const query = 'INSERT INTO access_logs (user_id, timestamp) VALUES (?, ?)';
    const values = [userId, new Date()];
    await db.query(query, values);
    //console.log('Access recorded for user with ID:', userId);
  } catch (error) {
    console.error('Error recording access:', error);
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
// Función para obtener los registros de acceso por usuario
async function getAccessLogsByUserId(userId) {
  try {
    const query = 'SELECT * FROM access_logs WHERE user_id = ?';
    const values = [userId];
    const accessLogs = await db.query(query, values);
    return accessLogs;
  } catch (error) {
    console.error('Error getting access logs:', error);
    throw error;
  }
}
async function changePassword(userId, newPassword) {
  try {
    const hashedPassword = await encryptPassword(newPassword);
    const query = 'UPDATE users SET password = ? WHERE id = ?';
    const values = [hashedPassword, userId];
    let response = await db.query(query, values);
    return {
      message : 'Password changed for user with ID:'+ userId,
      result : response,
      status : 'success'
    }
    
  } catch (error) {
    console.error('Error changing password:', error);
    //throw error;
    return {
      message : 'Error changing password:'+ error,
      result : error,
      status : 'failed'
    }
  }
}

module.exports = {
  authenticateUser,
  encryptPassword,
  getAccessLogsByUserId,
  changePassword
};
