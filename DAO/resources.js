const bcrypt = require('bcrypt');
const db = require('./db');
const dotenv = require('dotenv');
const users = require("./users");


dotenv.config();

// Función para autenticar al usuario
async function listArticles() {
  
  try {
    const query = 'SELECT * FROM articles';
    
    let articles = await db.query(query);

    for(article of articles ){
      console.log(JSON.stringify(article))
      let author = await users.getUser(article.creator)
      article.author = author;
      console.log(article)
      console.log(JSON.stringify(article))

    }

    return articles;

  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

async function createFile(fileData) {
  try {
    
    // Insertar el artículo en la base de datos
    const result = await db.query('INSERT INTO files SET ?', fileData);

    // Obtener el ID del archivo creado
    const fileId = result.insertId;
    fileData.id = fileId

    // Retornar el archivo creado
    return fileData;
  } catch (error) {
    console.error(error);
    throw new Error("Error creating file");
  }
}

async function createResource(resourceData) {
  try {
    // Insertar el artículo en la base de datos
    const result = await db.query('INSERT INTO resources SET ?', resourceData);

    // Obtener el ID del artículo creado
    const resourceId = result.insertId;

    resourceData.id = resourceId;

    // Retornar el artículo creado
    return resourceData;
  } catch (error) {
    console.error(error);
    throw new Error("Error creating resource");
  }
}

async function listResources() {
  try {
    const query = `
      SELECT
        resources.id,
        resources.file_id,
        resources.title,
        resources.description,
        categories.name AS category,
        categories.id AS category_id
      FROM
        resources
      JOIN
        categories ON resources.category_id = categories.id
    `;
    
    let result = await db.query(query);
    let resources = [];

    for (const row of result) {
      const resource = {
        id: row.id,
        file_id: row.file_id,
        title: row.title,
        description: row.description,
        category: row.category,
        category_id: row.category_id
      };

      resources.push(resource);
    }

    return resources;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}




module.exports = {
  createResource,
  createFile,
  listResources
};
