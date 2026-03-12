const express = require('express');
const router  = express.Router();
const db      = require('../config/db');

// FIX: specific routes FIRST, generic /:class/:subject LAST
// (otherwise /:class/:subject intercepts /progress/update and /static/*)

// POST /api/content/progress/update
router.post('/progress/update', (req, res) => {
    const { userId, pointsEarned, type } = req.body;
    if (!userId || pointsEarned === undefined || !type)
        return res.status(400).json({ error: "Missing fields" });

    let query = "UPDATE users SET points = points + ?";
    if (type === 'quiz')                     query += ", quizzesTaken = quizzesTaken + 1";
    if (type === 'notes' || type === 'game') query += ", lessons = lessons + 1";
    query += " WHERE id = ?";

    db.query(query, [pointsEarned, userId], (err) => {
        if (err) return res.status(500).json({ error: "Failed to update progress" });
        res.status(200).json({ message: "Progress updated!" });
    });
});

// GET /api/content/static/about
router.get('/static/about', (req, res) => {
    res.json({
        title: "🌱 About EduPadhai",
        paragraphs: ["EduPadhai makes learning fun for every student!"]
    });
});

// GET /api/content/static/contact
router.get('/static/contact', (req, res) => {
    res.json({
        title: "📩 Contact Us",
        email: "support@edupadhai.com",
        phone: "+91 91234 56789"
    });
});

// GET /api/content/:class/:subject  ← MUST be last
router.get('/:class/:subject', (req, res) => {
    const { class: classLevel, subject } = req.params;
    db.query(
        "SELECT id, chapter_name, activity_type FROM educational_content WHERE class_level = ? AND subject = ? ORDER BY id ASC",
        [classLevel, subject],
        (err, results) => {
            if (err) return res.status(500).json({ error: "Database error" });
            res.status(200).json(results);
        }
    );
});

module.exports = router;