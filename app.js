// ========== ./app.js ==========
const express = require('express');
const path = require('path');
const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// EJS & Static Files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'FRONTEND'));
app.use(express.static(path.join(__dirname, 'FRONTEND')));

// Import Backend Routes
const authRoutes = require('./BACKEND/routes/auth');
const contentRoutes = require('./BACKEND/routes/content');
const db = require('./BACKEND/config/db'); // Initialize DB connection

// Use API Routes
app.use('/api', authRoutes); // Maps to /api/login, /api/signup
app.use('/api/content', contentRoutes); // Maps to /api/content/...

// --- FRONTEND VIEW ROUTES ---
app.get('/', (req, res) => res.render('index'));
app.get('/dashboard', (req, res) => res.render('dashboard'));
app.get('/learn', (req, res) => res.render('learn'));
app.get('/about', (req, res) => res.render('about'));
app.get('/contact', (req, res) => res.render('contact'));
app.get('/help', (req, res) => res.render('help'));
app.get('/login', (req, res) => res.render('login'));
app.get('/signup', (req, res) => res.render('signup'));

// Dynamic Activity View Route (Needs direct DB access to render page)
app.get('/activity/:id', (req, res) => {
    const activityId = req.params.id;
    db.query("SELECT * FROM educational_content WHERE id = ?", [activityId], (err, results) => {
        if (err || results.length === 0) return res.status(404).send("Activity not found");
        const activity = results[0];
        res.render('activity', {
            topic: activity.chapter_name,
            cls: activity.class_level,
            subject: activity.subject,
            activityType: activity.activity_type,
            content: activity.content_data 
        });
    });
});
require('dotenv').config();
// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});