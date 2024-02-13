const db = require('./db');
const users = require('./users'); // Asegúrate de importar el módulo users si no lo has hecho

const cookieParser = require('cookie-parser');
const NodeCache = require('node-cache');
const { Console } = require('console');


async function createXAPILog(event_type, action, extra_info, req) {
    try {
        const sessionId = req.cookies.sessionId;
        const email = sessionId;
        let user = await users.getUserByEmail(email);

        const query = 'INSERT INTO xapi_logs (user_id, timestamp, event_type, action, extra_info) VALUES (?, ?, ?, ?, ?)';
        const values = [user.id, new Date(), event_type, action, extra_info];
        await db.query(query, values);
        //console.log('xAPI log created successfully');
    } catch (error) {
        console.error('Error creating xAPI log:', error);
        throw error;
    }
}
async function getXAPILogs() {
    try {
        const query = 'SELECT * FROM xapi_logs';
        const logs = await db.query(query);
        return logs;
    } catch (error) {
        console.error('Error getting xAPI logs:', error);
        throw error;
    }
}

module.exports = {
    createXAPILog,
    getXAPILogs,
};
