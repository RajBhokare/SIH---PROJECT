const express = require('express');
const path = require('path');
const app = express();
const PORT = 5000;

// Middleware to parse JSON (for forms like signup)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'frontend')); // EJS templates folder

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'frontend')));

// =========================
// Routes for your pages
// =========================
app.get('/', (req, res) => res.render('index'));
app.get('/dashboard', (req, res) => res.render('dashboard'));
app.get('/signup', (req, res) => res.render('signup'));
app.get('/contact', (req, res) => res.render('contact'));

// =========================
// Optional: Handle POST from signup form
// =========================
app.post('/signup', (req, res) => {
    const { name, email, phone, password } = req.body;
    console.log('Signup Data:', { name, email, phone, password });

    // Here you can store to DB or file
    res.redirect('/dashboard'); // redirect to dashboard after signup
});

// =========================
// Start server
// =========================
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
