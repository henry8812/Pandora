const bcrypt = require('bcrypt');
const db = require('./db');
const dotenv = require('dotenv');
const users = require("./users");


dotenv.config();

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
async function deleteResource(id) {
  try {
    
    // actualizarel recurso para que no sea visible ya que puede estar asociado a un elemento del sistema
    let values = [id]
    const result = await db.query('update resources set resource = 0 where id = ?',values);

    // Obtener el ID del archivo creado
   
    return id;
  } catch (error) {
    console.error(error);
    throw new Error("Error hiding resource");
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

async function listCategories(){
  try {
    const query = `
      SELECT
        *
      FROM
        categories
     
    `;
    
    let result = await db.query(query);
    //console.log("Categories:", result)
    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
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
      where resources.resource = 1
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
  listResources,
  listCategories,
  deleteResource
};
