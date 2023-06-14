const db = require('./db');

class UserDAO {
  async createUser(user) {
    try {
      const result = await db.query('INSERT INTO users SET ?', user);
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  async getUserByEmail(email) {
    try {
      const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Agrega otros métodos de acceso a datos relacionados con los usuarios según sea necesario
}

module.exports = new UserDAO();
