const db = require('./db');
const dotenv = require('dotenv');

dotenv.config();

async function getUserByEmail(email) {
  const query = 'SELECT users.email, users.name, users.id, roles.name AS role_name, users.role_id FROM users INNER JOIN roles ON roles.id = users.role_id WHERE email = ?';
  const values = [email];
  let user = await db.query(query, values);

  user[0].image = '/assets/images/profile.png';
  delete user[0].password;
  return user[0];
}

async function getUser(id) {
  try {
    const query = 'SELECT * FROM users WHERE id = ?';
    const values = [id];
    let user = await db.query(query, values);
    user[0].image = '/assets/images/profile.png';
    delete user[0].password;
    return user[0];
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

async function searchGuides(criteria) {
  try {
    const query = 'SELECT * FROM manuals WHERE LOWER(title) LIKE ? OR LOWER(content) LIKE ? OR LOWER(short_description) LIKE ?';
    const values = [`%${criteria.toLowerCase()}%`, `%${criteria.toLowerCase()}%`, `%${criteria.toLowerCase()}%`];
    let data = await db.query(query, values);

    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

async function searchArticles(criteria) {
  try {
    const query = 'SELECT * FROM manuals WHERE LOWER(title) LIKE ? OR LOWER(content) LIKE ? OR LOWER(short_description) LIKE ?';
    const values = [`%${criteria.toLowerCase()}%`, `%${criteria.toLowerCase()}%`, `%${criteria.toLowerCase()}%`];
    let data = await db.query(query, values);

    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

async function searchResources(criteria) {
  try {
    const query = 'SELECT MIN(id) AS id, title, MIN(description) AS description, MIN(file_id) AS file_id, MIN(category_id) AS category_id FROM resources WHERE LOWER(title) LIKE ? OR LOWER(description) LIKE ? GROUP BY title';

    const values = [`%${criteria.toLowerCase()}%`, `%${criteria.toLowerCase()}%`];
    let data = await db.query(query, values);

    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

module.exports = {
  searchGuides,
  searchArticles,
  searchResources,
  getUserByEmail,
  getUser,
};
