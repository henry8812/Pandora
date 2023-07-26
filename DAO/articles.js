const bcrypt = require('bcrypt');
const db = require('./db');
const dotenv = require('dotenv');
const users = require("../DAO/users");


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

async function getArticle(id) {

  try {
    const query = 'SELECT * FROM articles WHERE id = ? ';
    const values = [id];
    let article = await db.query(query, values);
    article = article[0]
    let author = await users.getUser(article.creator)
    article.author = author;
    console.log(article)
    console.log(JSON.stringify(article))

    let comments = await db.query("SELECT * FROM COMMENTS where comment_type_id =3 and object_id = ? order by created_at desc", values)
    article.comments = [];
    for(let i=0; i<comments.length;i++){
      let comment = comments[i];
      let user = comment.user_id
      let values_1 = [id, user]
      comment.rating = (await db.query("select * from ratings where object_type = 3 and object_id = ? and user_id = ? order by rating desc", values_1))[0];
      console.log(comment)
      article.comments.push(comment)
    }
    
    return article;

  } catch (error) {
    console.error('Error:', error);
    throw error;
  }  
}

async function createArticle(articleData) {
  try {
    // Obtener el usuario por su email
    console.log("cookie:", articleData.creator)
    const user = await users.getUserByEmail(articleData.creator);
    console.log("user:", user)
    
    // Verificar si se encontró el usuario
    if (!user) {
      throw new Error("User not found");
    }

    // Crear el artículo con la información proporcionada
    const newArticle = {
      title: articleData.title,
      banner: articleData.banner,
      short_description: articleData.shortDescription,
      content: articleData.content,
      creator: user.id,
      created_at: new Date(),
      updated_at: new Date()
    };

    console.log(JSON.stringify(newArticle, null, 4))

    // Insertar el artículo en la base de datos
    const result = await db.query('INSERT INTO articles SET ?', newArticle);

    // Obtener el ID del artículo creado
    const articleId = result.insertId;

    // Asignar el ID al artículo creado
    newArticle.id = articleId;

    // Retornar el artículo creado
    return newArticle;
  } catch (error) {
    console.error(error);
    throw new Error("Error creating article");
  }
}


module.exports = {
  listArticles,
  getArticle,
  createArticle
};
