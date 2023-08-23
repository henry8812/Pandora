const bcrypt = require('bcrypt');
const db = require('./db');
const dotenv = require('dotenv');
const users = require("../DAO/users");



dotenv.config();

async function createNews(newsData) {
  try {


    const creator = await users.getUserByEmail(newsData.author);
    // Crear el artículo con la información proporcionada
    console.log(JSON.stringify(newsData.banner, null, 4))
    const newInformation = {
      title: newsData.title,
      image_url: newsData.banner,
      content: newsData.content,
      publication_date: new Date(),
      expiration_date: newsData.expiration_date,
      status : 'ACTIVE',
      creator: creator.id
    };

    console.log(JSON.stringify(newInformation, null, 4))

    // Insertar el artículo en la base de datos
    const result = await db.query('INSERT INTO news SET ?', newInformation);

    // Obtener el ID del artículo creado
    const notification = result.insertId;

    // Asignar el ID al artículo creado
    newInformation.id = notification;

    // Retornar el artículo creado
    return newInformation;
  } catch (error) {
    console.error(error);
    throw new Error("Error creating new notification");
  }
}
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
    listNews,
    createNews
};
