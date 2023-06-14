const bcrypt = require('bcrypt');
const prompt = require('prompt');

const UserDAO = require('./DAO/userDAO');

prompt.start();

prompt.get(
  [
    { name: 'firstName', description: 'Enter first name:' },
    { name: 'lastName', description: 'Enter last name:' },
    { name: 'email', description: 'Enter email:' },
    { name: 'password', description: 'Enter password:', hidden: true },
  ],
  async (err, result) => {
    if (err) {
      console.error('Error getting admin details:', err);
      return;
    }

    const { firstName, lastName, email, password } = result;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: hashedPassword,
      role_id: 1,
    };

    try {
      const userId = await UserDAO.createUser(user);
      console.log(`Admin user created with ID: ${userId}`);
      process.exit(); // Agregar esta línea para cerrar el proceso
    } catch (error) {
      console.error('Error creating admin user:', error);
      process.exit(); // Agregar esta línea para cerrar el proceso
    }
  }
);
