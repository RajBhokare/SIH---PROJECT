const mysql = require('mysql2');
const path  = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Support DATABASE_URL (used by Render, Railway, PlanetScale, etc.)
// Falls back to individual env vars for local development
let db;

if (process.env.DATABASE_URL) {
    console.log('🔌 Connecting via DATABASE_URL...');
    db = mysql.createConnection(process.env.DATABASE_URL);
} else {
    // Validate required env vars
    const required = ['DB_HOST', 'DB_USER', 'DB_NAME'];
    const missing  = required.filter(key => !process.env[key]);
    if (missing.length) {
        console.error(`❌ Missing required env vars: ${missing.join(', ')}`);
        console.error('   Set them in your .env file (local) or deployment dashboard (production).');
        process.exit(1);
    }

    const config = {
        host:     process.env.DB_HOST,
        user:     process.env.DB_USER,
        password: process.env.DB_PASS || '',
        database: process.env.DB_NAME,
        port:     parseInt(process.env.DB_PORT, 10) || 3306
    };

    console.log(`🔌 Connecting to MySQL as "${config.user}" @ ${config.host}:${config.port}/${config.database}`);
    db = mysql.createConnection(config);
}

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

    // Auto-reconnect if connection drops
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