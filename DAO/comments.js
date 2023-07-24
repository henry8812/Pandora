const bcrypt = require('bcrypt');
const db = require('./db');
const dotenv = require('dotenv');
const users = require("../DAO/users");


dotenv.config();
async function createComment(data){
    console.log(data)
    return null
}

module.exports = {
    createComment
  };
  