const bcrypt = require('bcrypt');
const db = require('./db');
const dotenv = require('dotenv');
const users = require("../DAO/users");


dotenv.config();

// Función para autenticar al usuario
async function listArticles() {
  
  try {
    const query = 'SELECT * FROM articles ORDER BY ID DESC';
    
    let articles = await db.query(query);

    for(article of articles ){
      
      let author = await users.getUser(article.creator)
      article.author = author;
      

    }

    return articles;

  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

async function listFrontArticles() {
  
  try {
    const query = 'SELECT pandora.articles.* FROM pandora.articles join pandora.article_target_association on pandora.article_target_association.article_id = pandora.articles.id where pandora.article_target_association.target_id = 3  ORDER BY ID DESC';
    
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
async function listPremiumArticles() {
  
  try {
    const query = 'SELECT pandora.articles.* FROM pandora.articles join pandora.article_target_association on pandora.article_target_association.article_id = pandora.articles.id where pandora.article_target_association.target_id = 5 ORDER BY ID DESC';
    
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
async function listOpsArticles() {
  
  try {
    const query = 'SELECT pandora.articles.* FROM pandora.articles join pandora.article_target_association on pandora.article_target_association.article_id = pandora.articles.id where pandora.article_target_association.target_id = 6 ORDER BY ID DESC';
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
async function listToolsArticles() {
  
  try {
    const query = 'SELECT pandora.articles.* FROM pandora.articles join pandora.article_target_association on pandora.article_target_association.article_id = pandora.articles.id where pandora.article_target_association.target_id = 7 ORDER BY ID DESC';
    
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


async function deleteArticle(id) {
  try {
    // Eliminar comentarios asociados al artículo
   
    await db.query("DELETE FROM ratings WHERE comment_type_id = 3 AND object_id = ?", [id]);
    // Eliminar calificaciones asociadas al artículo
    await db.query("DELETE FROM comments WHERE comment_type_id = 3 AND object_id = ?", [id]);

    // Eliminar el artículo
    await db.query("DELETE FROM articles WHERE id = ?", [id]);

    console.log(`Artículo con ID ${id} y sus comentarios/calificaciones asociadas han sido eliminados.`);
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

    let comments = await db.query("SELECT * FROM COMMENTS join users on users.id =  comments.user_id where comment_type_id =3 and object_id = ? order by created_at desc", values)
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
      //target_id : articleData.target_id
    };

    console.log(JSON.stringify(newArticle, null, 4))

    // Insertar el artículo en la base de datos
    const result = await db.query('INSERT INTO articles SET ?', newArticle);

    // Obtener el ID del artículo creado
    const articleId = result.insertId;

    // Asignar el ID al artículo creado
    newArticle.id = articleId;
    for( var i=0; i < articleData.target_id.length; i++){
      let associationData = {
        article_id : articleId,
        target_id :parseInt( articleData.target_id[i])
      }
      await db.query('INSERT INTO article_target_association (article_id,target_id) VALUES (?,?)', [articleId,associationData.target_id])
      
    }
    // Retornar el artículo creado

    return newArticle;
  } catch (error) {
    console.error(error);
    throw new Error("Error creating article");
  }
}

async function listSelectedArticles(values) {
  console.log("values:",values)
  try {
    const placeholders = values.map(() => '?').join(', ');
    const query = `SELECT pandora.articles.* FROM pandora.articles WHERE pandora.articles.id IN (${placeholders}) ORDER BY ID DESC`;
    console.log(query)
    let articles = await db.query(query, values);

    for (article of articles) {
      let author = await users.getUser(article.creator)
      article.author = author;
    }

    return articles;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

function ordenarObjetoPorValorNumerico(objeto,n=4 ) {

  const keysSorted = Object.keys(objeto).sort((a, b) => objeto[b] - objeto[a]);
  const topNKeys = keysSorted.slice(0, n);
  return topNKeys;
  
}



async function listPopularArticles() {
  
  try {
    const query = 'SELECT pandora.xapi_logs.extra_info from pandora.xapi_logs where event_type = "ARTICLE OPENED"';
    let data = await db.query(query);

    let aux = {}
    for(record  of data ){
      let value = JSON.parse(record.extra_info)
      if (aux[value.article.id] === undefined){
        aux[value.article.id] = 1
      } else {
        aux[value.article.id] += 1
      }
    }
    console.log(aux)
    aux = ordenarObjetoPorValorNumerico(aux)
    console.log(aux)
    list = await listSelectedArticles(aux)
    console.log("lista")
    console.log(list)

    return list;

  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}


module.exports = {
  listArticles,
  getArticle,
  createArticle,
  listFrontArticles,
  listPremiumArticles,
  listOpsArticles,
  listToolsArticles,
  deleteArticle,
  listPopularArticles

};
