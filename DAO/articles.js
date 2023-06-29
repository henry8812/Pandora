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
    return article;

  } catch (error) {
    console.error('Error:', error);
    throw error;
  }  
}


module.exports = {
  listArticles,
  getArticle
};
