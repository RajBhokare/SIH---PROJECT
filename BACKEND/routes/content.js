// ========== BACKEND/routes/content.js ==========
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Fetch Chapters for a Subject
router.get('/:class/:subject', (req, res) => {
    const { class: classLevel, subject } = req.params;
    const query = "SELECT id, chapter_name, activity_type FROM educational_content WHERE class_level = ? AND subject = ?";
    
    db.query(query, [classLevel, subject], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.status(200).json(results);
    });
});

// Update Gamification Progress
router.post('/progress/update', (req, res) => {
    const { userId, pointsEarned, type } = req.body;
    
    let query = "UPDATE users SET points = points + ?";
    if (type === 'quiz') query += ", quizzesTaken = quizzesTaken + 1";
    if (type === 'notes' || type === 'game') query += ", lessons = lessons + 1";
    query += " WHERE id = ?";

    db.query(query, [pointsEarned, userId], (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to update progress" });
        res.status(200).json({ message: "Progress updated successfully!" });
    });
});

// About/Contact Static Content
const staticContent = {
    about: { title: "🌱 About EduQuest", paragraphs: ["EduQuest makes learning fun for rural communities."] },
    contact: { title: "📩 Contact Us", email: "support@eduquest.in", phone: "+91 91234 56789" }
};
router.get('/static/about', (req, res) => res.json(staticContent.about));
router.get('/static/contact', (req, res) => res.json(staticContent.contact));

module.exports = router;