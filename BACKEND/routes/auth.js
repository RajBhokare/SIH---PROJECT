const express = require('express');
const router  = express.Router();
const db      = require('../config/db');

// POST /api/signup
router.post('/signup', (req, res) => {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password)
        return res.status(400).json({ error: "Name, email and password are required." });

    db.query("SELECT id FROM users WHERE email = ?", [email], (err, results) => {
        if (err) {
            console.error('Signup DB error:', err);
            return res.status(500).json({ error: "Database error. Please try again." });
        }
        if (results.length > 0)
            return res.status(400).json({ error: "An account with this email already exists." });

        db.query(
            "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)",
            [name, email, phone, password],
            (err, result) => {
                if (err) {
                    console.error('Signup insert error:', err);
                    return res.status(500).json({ error: "Failed to create account. Please try again." });
                }
                res.status(201).json({
                    message: "Signup successful",
                    user: { id: result.insertId, name, email, phone, points: 50, badges: 1, lessons: 0, quizzesTaken: 0 }
                });
            }
        );
    });
});

// POST /api/login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ error: "Email and password are required." });

    db.query(
        "SELECT * FROM users WHERE email = ? AND password = ?",
        [email, password],
        (err, results) => {
            if (err) {
                console.error('Login DB error:', err);
                return res.status(500).json({ error: "Database error. Please try again." });
            }
            if (results.length === 0)
                return res.status(401).json({ error: "Invalid email or password." });

            const user = { ...results[0] };
            delete user.password;
            res.status(200).json({ message: "Login successful", user });
        }
    );
});

// GET /api/user/:id
router.get('/user/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    if (!userId) return res.status(400).json({ error: "Invalid user ID." });

    db.query(
        "SELECT id, name, email, points, badges, lessons, quizzesTaken FROM users WHERE id = ?",
        [userId],
        (err, results) => {
            if (err) {
                console.error('Get user DB error:', err);
                return res.status(500).json({ error: "Database error. Please try again." });
            }
            if (results.length === 0)
                return res.status(404).json({ error: "User not found." });

            res.status(200).json(results[0]);
        }
    );
});

module.exports = router;