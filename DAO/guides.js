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
    let aux = guideData;
    let target = guideData.target_id
    delete aux.target_id
    //console.log("aux")
    //console.log(aux)
    const result = await db.query('INSERT INTO manuals SET ?', aux);
    
    const guideId = result.insertId;
    for( var i=0; i < target.length; i++){
      //console.log("lap")
      let associationData = {
        manual_id : guideId,
        target_id :parseInt( target[i])
      }
      await db.query('INSERT INTO manual_target_association (manual_id,target_id) VALUES (?,?)', [guideId,associationData.target_id])
      
    }
    return guideId

  } catch (error) {
    //console.log(error)
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

    //console.log(`Manual con ID ${id} y sus comentarios/calificaciones asociadas han sido eliminados.`);
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
   
    const query = 'SELECT pandora.manuals.* FROM pandora.manuals join pandora.manual_target_association on pandora.manual_target_association.manual_id = pandora.manuals.id where pandora.manual_target_association.target_id = 3';
    let manuals = await db.query(query);
    

    return manuals;

  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
async function listPremiumGuides() {
  
  try {
    const query = 'SELECT pandora.manuals.* FROM pandora.manuals join pandora.manual_target_association on pandora.manual_target_association.manual_id = pandora.manuals.id where pandora.manual_target_association.target_id = 5';
    
    let manuals = await db.query(query);
    

    return manuals;

  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
async function listOpsGuides() {
  
  try {
    const query = 'SELECT pandora.manuals.* FROM pandora.manuals join pandora.manual_target_association on pandora.manual_target_association.manual_id = pandora.manuals.id where pandora.manual_target_association.target_id = 6';
    
    let manuals = await db.query(query);
    

    return manuals;

  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
async function listToolsGuides() {
  
  try {
    const query = 'SELECT pandora.manuals.* FROM pandora.manuals join pandora.manual_target_association on pandora.manual_target_association.manual_id = pandora.manuals.id where pandora.manual_target_association.target_id = 7';
    
    let manuals = await db.query(query);
    

    return manuals;

  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

async function getGuide(id) {

  try {
    //console.log(id)
    const query = 'SELECT * FROM manuals WHERE id = ? ';
    const values = [id];
    let manual = await db.query(query, values);
    if(manual.length > 0) {
      manual = manual[0]
      let comments = await db.query("SELECT * FROM COMMENTS join users on users.id = comments.user_id where comment_type_id =1 and object_id = ? order by created_at desc", values)
      manual.comments = [];
      for(let i=0; i<comments.length;i++){
        let comment = comments[i];
        let author = comment.user_id
        let values_1 = [id, author]
        comment.rating = (await db.query("select * from ratings where object_type = 1 and object_id = ? and user_id = ? order by rating desc", values_1))[0];
        //console.log(comment)
        manual.comments.push(comment)
      }
  
      let file = await getFile(manual.file_id)
      if(file){
        manual.file =`/files/${file.path}`;
      }
      
      
  
      return manual;
    } else {
      return listGuides();
    } 
    

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
