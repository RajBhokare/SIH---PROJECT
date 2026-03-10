// ========== BACKEND/config/db.js ==========
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'data', // Change to your actual password
    database: 'eduquest_db'
});

db.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed: ' + err.stack);
        return;
    }
    console.log('✅ Connected to MySQL Database');
});

module.exports = db;