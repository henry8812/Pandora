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

const getActivitiesByCategory = async () => {
  try {
    const query = `
      SELECT activity.id, activity.short_description, activity.category, activity_type.name AS category_name
      FROM activity
      INNER JOIN activity_type ON activity.category = activity_type.id
    `;
    const result = await db.query(query);

    if (Array.isArray(result) && result.length > 0) {
      return result;
    } else {
      return [];
    }
  } catch (error) {
    throw error;
  }
};




module.exports = {
    getEmployee,
    getActivitiesByCategory
}
