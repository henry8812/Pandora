const bcrypt = require('bcrypt');
const db = require('./db');
const dotenv = require('dotenv');

dotenv.config();

// Función para autenticar al usuario
async function getUserByEmail(email) {
  console.log(email)
  const query = 'SELECT users.email, users.name, users.id, roles.name AS role_name, users.role_id, users.phone, users.document FROM users inner join roles on roles.id = users.role_id WHERE email = ?';
  const values = [email];
  let user = await db.query(query, values);
  delete user[0].password
  return user[0];
  
}

async function getUser(id) {
  try {
    const query = 'SELECT * FROM users WHERE id = ?';
    const values = [id];
    let user = await db.query(query, values);
    user[0].image = "/assets/images/profile.png";
    delete user[0].password
    return user[0];
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
async function getUserByName(name) {
  try {
    console.log(name)
    const query = "SELECT * FROM users WHERE name like ?";
    const values = [name];
    let user = await db.query(query, values);
    //user[0].image = "/assets/images/profile.png";
    console.log(user)
    delete user[0].password
    return user[0];
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}


module.exports = {
  getUser,
  getUserByEmail,
  getUserByName
};
