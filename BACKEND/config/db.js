const mysql = require('mysql2');

// Only load .env in local development — Render/Railway inject vars directly
if (process.env.NODE_ENV !== 'production') {
    const path = require('path');
    require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
}

let poolConfig;

if (process.env.DATABASE_URL) {
    console.log('🔌 Connecting via DATABASE_URL...');
    poolConfig = process.env.DATABASE_URL;
} else {
    // Validate required env vars
    const required = ['DB_HOST', 'DB_USER', 'DB_NAME'];
    const missing  = required.filter(key => !process.env[key]);
    if (missing.length) {
        console.error(`❌ Missing required env vars: ${missing.join(', ')}`);
        console.error('   Set them in your .env file (local) or Render dashboard (production).');
        process.exit(1);
    }

    poolConfig = {
        host:               process.env.DB_HOST,
        user:               process.env.DB_USER,
        password:           process.env.DB_PASS || '',
        database:           process.env.DB_NAME,
        port:               parseInt(process.env.DB_PORT, 10) || 3306,
        waitForConnections: true,
        connectionLimit:    10,
        queueLimit:         0
    };

    console.log(`🔌 Connecting to MySQL as "${poolConfig.user}" @ ${poolConfig.host}:${poolConfig.port}/${poolConfig.database}`);
}

// Use a connection POOL instead of a single connection
// Pools auto-reconnect and handle dropped connections — no manual reconnect needed
const pool = mysql.createPool(poolConfig);

// Test the connection on startup
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ DB connection failed:', err.message);
        console.error('   Check your DB credentials in Render environment variables.');
        // Do NOT call process.exit here — let the server start; DB errors will surface per-request
        return;
    }
    console.log('✅ MySQL pool connected successfully!');
    connection.release();
});

module.exports = pool;