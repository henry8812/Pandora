const bcrypt = require('bcrypt');
const db = require('./db');
const dotenv = require('dotenv');
const users = require("../DAO/users");


dotenv.config();
async function createComment(data){
    try {
        console.log(JSON.stringify(data, null, 4))
        console.log("cookie:", data.author)
        const user = await users.getUserByEmail(data.author);
        console.log("user:", user)
        
        // Crear el artículo con la información proporcionada
        const newComment = {
            object_id: data.object_id,
            user_id:    user.id,
            comment_text : data.comment,
            comment_type_id:   data.object_type,
            created_at: new Date()
        };
        
        
        
        // Insertar el artículo en la base de datos
        const result = await db.query('INSERT INTO comments SET ?', newComment);
        
        // Obtener el ID del artículo creado
        const commentId = result.insertId;
        
        // Asignar el ID al artículo creado
        newComment.id = commentId;
        
        // Retornar el artículo creado
        return newComment;
    } catch (error) {
        console.error(error);
        throw new Error("Error creating comment");
    }
}

module.exports = {
    createComment
};
