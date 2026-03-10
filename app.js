const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const app = express();
const PORT = 5000;

// Middleware to parse JSON and URL-encoded data [cite: 2]
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set EJS view engine and static files [cite: 2]
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'FRONTEND'));
app.use(express.static(path.join(__dirname, 'FRONTEND')));

// --- MYSQL DATABASE CONNECTION ---
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Default MySQL username
    password: 'data', // ⚠️ Change this to your actual MySQL password!
    database: 'eduquest_db'
});

db.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed: ' + err.stack);
        return;
    }
    console.log('✅ Connected to MySQL Database');
});

// --- MOCK CONTENT DB (For About/Contact Pages) ---
const contentDB = {
    about: {
        title: "🌱 About EduQuest",
        paragraphs: [
            "EduQuest is specially designed to make learning fun, interactive, and engaging for students in rural communities.",
            "We believe education should be an exciting journey of discovery, bringing high-quality resources directly to your phone."
        ]
    },
    contact: {
        title: "📩 Contact Us",
        email: "support@eduquest.in",
        phone: "+91 91234 56789"
    }
};

// --- API ROUTES ---
app.get('/api/about', (req, res) => res.json(contentDB.about));
app.get('/api/contact', (req, res) => res.json(contentDB.contact));

// Auth API: Signup
app.post('/api/signup', (req, res) => {
    const { name, email, phone, password } = req.body;

    // First, check if user already exists
    const checkQuery = "SELECT * FROM users WHERE email = ?";
    db.query(checkQuery, [email], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (results.length > 0) return res.status(400).json({ error: "User already exists!" });

        // If user doesn't exist, insert them into the database
        const insertQuery = "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)";
        db.query(insertQuery, [name, email, phone, password], (err, result) => {
            if (err) return res.status(500).json({ error: "Failed to register user" });
            
            res.status(201).json({ 
                message: "Signup successful", 
                user: { id: result.insertId, name, email, phone, points: 50, badges: 1, lessons: 0, quizzesTaken: 0 } 
            });
        });
    });
});

// Auth API: Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    const query = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.query(query, [email, password], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        
        if (results.length > 0) {
            // User found, send user data back to frontend (excluding password)
            const user = results[0];
            delete user.password; 
            res.status(200).json({ message: "Login successful", user });
        } else {
            res.status(401).json({ error: "Invalid email or password" });
        }
    });
});

// Auth API: Get fresh user data (Sync progress)
app.get('/api/user/:id', (req, res) => {
    const userId = req.params.id;

    const query = "SELECT id, name, email, points, badges, lessons, quizzesTaken FROM users WHERE id = ?";
    db.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        
        if (results.length > 0) {
            res.status(200).json(results[0]);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    });
});

// --- VIEW ROUTES --- [cite: 3, 4, 5]
app.get('/', (req, res) => res.render('index'));
app.get('/dashboard', (req, res) => res.render('dashboard'));
app.get('/learn', (req, res) => res.render('learn'));
app.get('/about', (req, res) => res.render('about'));
app.get('/contact', (req, res) => res.render('contact'));
app.get('/help', (req, res) => res.render('help'));
app.get('/login', (req, res) => res.render('login'));
app.get('/signup', (req, res) => res.render('signup'));

// Start server [cite: 5]
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});