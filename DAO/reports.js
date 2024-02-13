const bcrypt = require('bcrypt');
const db = require('./db');
const dotenv = require('dotenv');
const users = require("./users");


dotenv.config();

async function getAccessData(start, end) {
  try {
    let date = new Date(end)
    date.setDate(date.getDate()+1)
    ////console.log(date)
    end = date;
    const query = 'SELECT access_logs.id, access_logs.user_id, access_logs.timestamp, users.name FROM access_logs join users on users.id = access_logs.user_id where timestamp >= ? and timestamp <= ? order by id asc' ;
    const values = [start, end]
    let data = await db.query(query, values);
    ////console.log(data)

    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
async function getAccessLogs(start,end){
  try {
    let date = new Date(end)
    date.setDate(date.getDate()+1)
    ////console.log(date)
    end = date;
    const query = 'SELECT access_logs.timestamp, users.name FROM access_logs join users on users.id = access_logs.user_id where timestamp >= ? and timestamp <= ? order by access_logs.id asc' ;
    //console.log(query)
    const values = [start, end]
    let data = await db.query(query, values);
    ////console.log(data)

    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

async function getUseData() {
 return null
}

module.exports = {
  getAccessData,
  getUseData,
  getAccessLogs
};
