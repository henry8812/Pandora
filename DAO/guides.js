const bcrypt = require('bcrypt');
const db = require('./db');
const dotenv = require('dotenv');




dotenv.config();
async function getFile(id) {
  try {

    const query = 'SELECT * FROM files WHERE id = ?';
    const values = [id];
    let file = await db.query(query, values);
    file = file[0];
    return file;

  } catch (error) {
        console.error('Error:', error);
    throw error;
  }
}
async function createGuide(guideData) {
  try {
    const result = await db.query('INSERT INTO manuals SET ?', guideData);
    
    const guideId = result.insertId;
    return guideId

  } catch (error) {
    console.log(error)
  }
  return null;
}

// Función para autenticar al usuario
async function listGuides() {
  
  try {
    const query = 'SELECT * FROM manuals';
    
    let manuals = await db.query(query);
    

    return manuals;

  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

async function getGuide(id) {

  try {
    const query = 'SELECT * FROM manuals WHERE id = ? ';
    const values = [id];
    let manual = await db.query(query, values);
    manual = manual[0]
    let file = await getFile(manual.file_id)
    manual.file =`/files/${file.path}`;
    

    return manual;

  } catch (error) {
    console.error('Error:', error);
    throw error;
  }  
}


module.exports = {
  listGuides,
  getGuide,
  createGuide
};
