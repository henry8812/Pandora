const db = require('./db');


   const getEmployee= async(username) => {
    try {
      const result = await db.query('select * from employees where username = ?', username);
      return result;
    } catch (error) {
      throw error;
    }
  }

  const getUserByEmail =async(email) => {
    try {
      const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      return rows[0];
    } catch (error) {
      throw error;
    }


  // Agrega otros métodos de acceso a datos relacionados con los usuarios según sea necesario
}

module.exports = {
    getEmployee
}
