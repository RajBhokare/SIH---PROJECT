const mysql = require('mysql2');
const path  = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const config = {
    host:     process.env.DB_HOST || 'localhost',
    user:     process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',   // FIX: empty string default, not 'user'
    database: process.env.DB_NAME || 'eduquest_db'
};

console.log(`🔌 Connecting to MySQL as "${config.user}" @ "${config.database}"`);

const db = mysql.createConnection(config);

function connectDB() {
    db.connect((err) => {
        if (err) {
            console.error('❌ DB connection failed:', err.message);
            console.log('🔄 Retrying in 5s...');
            setTimeout(connectDB, 5000);
            return;
        }
        console.log('✅ MySQL connected successfully!');
    });

    // FIX: auto-reconnect if connection drops
    db.on('error', (err) => {
        console.error('⚠️  DB error:', err.code);
        if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
            connectDB();
        } else {
            throw err;
        }
    });
}

connectDB();
module.exports = db;