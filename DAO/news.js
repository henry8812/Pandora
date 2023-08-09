const bcrypt = require('bcrypt');
const db = require('./db');
const dotenv = require('dotenv');




dotenv.config();
async function listNews() {
  try {
    let now = new Date();
    const query = 'SELECT * FROM news WHERE expiration_date > ?';
    const values = [now];
    let file = await db.query(query, values);
 
    return file;

  } catch (error) {
        console.error('Error:', error);
    throw error;
  }
}


module.exports = {
    listNews
};
