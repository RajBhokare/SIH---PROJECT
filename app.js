const express = require('express');
const path = require('path');
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'frontend'));

// Serve static files
app.use(express.static(path.join(__dirname, 'frontend')));

// Routes
app.get('/', (req, res) => res.render('index'));
app.get('/dashboard', (req, res) => res.render('dashboard'));
app.get('/learn', (req, res) => res.render('learn'));
app.get('/about', (req, res) => res.render('about'));
app.get('/contact', (req, res) => res.render('contact'));
app.get('/help', (req, res) => res.render('help'));
app.get('/login', (req, res) => res.render('login'));
app.get('/signup', (req, res) => res.render('signup'));

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
