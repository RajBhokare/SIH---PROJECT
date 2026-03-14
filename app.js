// Only load .env in local development — Render/Railway inject vars directly
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const path    = require('path');
const app     = express();
const PORT    = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'FRONTEND'));
app.use(express.static(path.join(__dirname, 'FRONTEND')));

const authRoutes    = require('./BACKEND/routes/auth');
const contentRoutes = require('./BACKEND/routes/content');
const db            = require('./BACKEND/config/db');

app.use('/api',         authRoutes);
app.use('/api/content', contentRoutes);

app.get('/',          (req, res) => res.render('index'));
app.get('/dashboard', (req, res) => res.render('dashboard'));
app.get('/learn',     (req, res) => res.render('learn'));
app.get('/about',     (req, res) => res.render('about'));
app.get('/contact',   (req, res) => res.render('contact'));
app.get('/help',      (req, res) => res.render('help'));
app.get('/login',     (req, res) => res.render('login'));
app.get('/signup',    (req, res) => res.render('signup'));

// Activity route — safely parses content_data JSON before passing to EJS
app.get('/activity/:id', (req, res) => {
    db.query(
        "SELECT * FROM educational_content WHERE id = ?",
        [req.params.id],
        (err, results) => {
            if (err) {
                console.error('DB error on /activity/:id', err);
                return res.status(500).send("Server error. Please try again.");
            }
            if (results.length === 0)
                return res.status(404).send("Activity not found");

            const activity = results[0];
            let contentData = {};
            try {
                contentData = typeof activity.content_data === 'string'
                    ? JSON.parse(activity.content_data)
                    : activity.content_data || {};
            } catch (e) {
                contentData = { body: String(activity.content_data || '') };
            }

            res.render('activity', {
                topic:        activity.chapter_name,
                cls:          activity.class_level,
                subject:      activity.subject,
                activityType: activity.activity_type,
                content:      contentData
            });
        }
    );
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).send('<h1>Something went wrong</h1><a href="/">Go Home</a>');
});

// 404 handler
app.use((req, res) => res.status(404).send('<h1>404 — Page not found</h1><a href="/">Go Home</a>'));

app.listen(PORT, () => console.log(`✅ Server running → http://localhost:${PORT}`));