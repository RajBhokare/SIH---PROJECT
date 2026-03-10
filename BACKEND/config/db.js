const mysql = require('mysql2');
const path = require('path');

// Try to load env from absolute path
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// PROOF TEST: If these are undefined, the .env file isn't being read correctly
const dbUser = process.env.DB_USER || 'root'; // Fallback to 'root'
const dbPass = process.env.DB_PASS || 'user'; // Fallback to 'user'
const dbName = process.env.DB_NAME || 'eduquest_db';

console.log("--- Connection Attempt ---");
console.log(`User: "${dbUser}"`); 
console.log(`DB: "${dbName}"`);
console.log("--------------------------");

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: dbUser,
    password: dbPass,
    database: dbName
});

db.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed. Possible reasons:');
        console.error('1. MySQL Service is not running.');
        console.error('2. Password "user" is incorrect for user "root".');
        console.error('3. Database "eduquest_db" does not exist.');
        return;
    }
    console.log('✅ Connected to MySQL successfully!');
});

module.exports = db;