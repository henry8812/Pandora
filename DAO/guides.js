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

async function deleteGuide(id) {
  try {
    // Eliminar comentarios asociados al artículo
   
    await db.query("DELETE FROM ratings WHERE comment_type_id = 1 AND object_id = ?", [id]);
    // Eliminar calificaciones asociadas al artículo
    await db.query("DELETE FROM comments WHERE comment_type_id = 1 AND object_id = ?", [id]);

    // Eliminar el artículo
    await db.query("DELETE FROM manuals WHERE id = ?", [id]);

    console.log(`Manual con ID ${id} y sus comentarios/calificaciones asociadas han sido eliminados.`);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
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

async function listFrontGuides() {
  
  try {
    const query = 'SELECT * FROM manuals where target_id = 3';
    
    let manuals = await db.query(query);
    

    return manuals;

  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
async function listPremiumGuides() {
  
  try {
    const query = 'SELECT * FROM manuals where target_id = 5';
    
    let manuals = await db.query(query);
    

    return manuals;

  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
async function listOpsGuides() {
  
  try {
    const query = 'SELECT * FROM manuals where target_id = 6';
    
    let manuals = await db.query(query);
    

    return manuals;

  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
async function listToolsGuides() {
  
  try {
    const query = 'SELECT * FROM manuals where target_id = 7';
    
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
    let comments = await db.query("SELECT * FROM COMMENTS where comment_type_id =1 and object_id = ? order by created_at desc", values)
    manual.comments = [];
    for(let i=0; i<comments.length;i++){
      let comment = comments[i];
      let author = comment.user_id
      let values_1 = [id, author]
      comment.rating = (await db.query("select * from ratings where object_type = 1 and object_id = ? and user_id = ? order by rating desc", values_1))[0];
      console.log(comment)
      manual.comments.push(comment)
    }

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
  createGuide,
  listFrontGuides,
  listPremiumGuides,
  listOpsGuides,
  listToolsGuides,
  deleteGuide

};
