const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Create a connection pool to the MySQL database
const pool = mysql.createPool({
    host: 'localhost',      // Your MySQL host (e.g., 'localhost')
    user: 'root',  // Your MySQL username
    password: 'Mayur@1104', // Your MySQL password
    database: 'ecolearn_db', // The name of your database
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test the database connection
(async () => {
    try {
        await pool.getConnection();
        console.log('Successfully connected to the MySQL database.');
    } catch (error) {
        console.error('Database connection failed:', error);
    }
})();

// API Endpoint for Sign-up using MySQL
app.post('/api/signup', async (req, res) => {
    const { name, email, phone, password } = req.body;
    try {
        // Check if user already exists
        const [rows] = await pool.execute(
            'SELECT email FROM users WHERE email = ?',
            [email]
        );
        if (rows.length > 0) {
            return res.status(409).json({ message: 'User with this email already exists.' });
        }

        // Insert new user into the database
        await pool.execute(
            'INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)',
            [name, email, phone, password]
        );

        res.status(201).json({ message: 'Signup successful!' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Add other API endpoints (dashboard, about, etc.) with MySQL queries
// Example: fetching about page data from a "site_info" table
app.get('/api/about', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT title, paragraphs FROM site_info WHERE id = 1');
        if (rows.length > 0) {
            const data = rows[0];
            data.paragraphs = data.paragraphs.split('\n'); // Assuming paragraphs are stored with newlines
            res.json(data);
        } else {
            res.status(404).json({ message: 'About Us data not found.' });
        }
    } catch (error) {
        console.error('About page error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});