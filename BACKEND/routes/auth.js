// ========== BACKEND/routes/auth.js ==========
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Signup Route
router.post('/signup', (req, res) => {
    const { name, email, phone, password } = req.body;
    const checkQuery = "SELECT * FROM users WHERE email = ?";
    
    db.query(checkQuery, [email], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (results.length > 0) return res.status(400).json({ error: "User already exists!" });

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

// Login Route
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const query = "SELECT * FROM users WHERE email = ? AND password = ?";
    
    db.query(query, [email, password], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (results.length > 0) {
            const user = results[0];
            delete user.password; 
            res.status(200).json({ message: "Login successful", user });
        } else {
            res.status(401).json({ error: "Invalid email or password" });
        }
    });
});

// Sync User Progress Route
router.get('/user/:id', (req, res) => {
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

module.exports = router;