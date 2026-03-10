# 🚀 EduPadhai — Gamified Learning Platform

> **Making quality education fun, interactive, and accessible for every student.**

EduPadhai is a full-stack gamified e-learning platform designed for students in Classes 6–12. It combines educational content with game-like mechanics — XP points, ranks, and badges — to encourage consistent learning habits and a genuine excitement for discovery.

---

## 📸 Preview

| Home | Dashboard | Learn |
|------|-----------|-------|
| Landing page with course cards | XP bar, stats & badges | Step-by-step class → subject → chapter |

---

## ✨ Features

- 🎮 **Gamified XP System** — Earn experience points by completing lessons, quizzes and games. Level up from Beginner → Scholar → Master.
- 📚 **Course Library** — Interactive content across Mathematics, Science, Computer Science and English for Classes 6–9.
- 📝 **Quiz Engine** — Multi-question quizzes with instant feedback, correct/wrong highlighting and XP rewards.
- 🎯 **Personalized Dashboard** — Real-time stats: lessons completed, quizzes taken, total XP and badges earned.
- 🔐 **Authentication** — Signup / Login with user data persisted in MySQL.
- 📱 **Responsive Design** — Neo-Brutalist UI that works on desktop and mobile.
- ♿ **Accessibility** — Built with rural and low-bandwidth users in mind.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | EJS Templates, Custom CSS (Neo-Brutalist), Vanilla JS |
| **Backend** | Node.js, Express.js |
| **Database** | MySQL (JSON columns for curriculum data) |
| **Styling** | Nunito font, CSS custom properties, Bootstrap 5 grid |

---

## 📂 Project Structure

```
EDUQUEST/
├── app.js                        # Main Express server entry point
├── package.json
│
├── BACKEND/
│   ├── config/
│   │   └── db.js                 # MySQL connection with auto-reconnect
│   └── routes/
│       ├── auth.js               # POST /api/login  POST /api/signup  GET /api/user/:id
│       └── content.js            # GET /api/content/:class/:subject  POST /api/content/progress/update
│
└── FRONTEND/
    ├── css/
    │   └── style.css             # Full design system
    ├── images/                   # Logo and assets
    ├── index.ejs                 # Landing page
    ├── dashboard.ejs             # User stats & XP dashboard
    ├── learn.ejs                 # Class → Subject → Chapter selector
    ├── activity.ejs              # Notes / Quiz / Game viewer
    ├── about.ejs                 # About the platform
    ├── contact.ejs               # Contact details
    ├── help.ejs                  # Help & FAQ
    ├── login.ejs                 # Login page
    ├── signup.ejs                # Signup page
    ├── header.ejs                # Shared navbar (included in all pages)
    └── footer.ejs                # Shared footer (included in all pages)
```

---

## ⚙️ Installation & Setup

### 1. Prerequisites

- [Node.js](https://nodejs.org/) v18+ installed
- MySQL server running locally

---

### 2. Database Setup

Open **MySQL Workbench** (or any MySQL client) and run:

```sql
CREATE DATABASE eduquest_db;
USE eduquest_db;

-- Users table
CREATE TABLE users (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(100),
    email        VARCHAR(100) UNIQUE,
    phone        VARCHAR(15),
    password     VARCHAR(255),
    points       INT DEFAULT 50,
    badges       INT DEFAULT 1,
    lessons      INT DEFAULT 0,
    quizzesTaken INT DEFAULT 0
);

-- Educational content table
CREATE TABLE educational_content (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    class_level   VARCHAR(10),
    subject       VARCHAR(50),
    chapter_name  VARCHAR(100),
    activity_type VARCHAR(20),   -- 'notes' | 'quiz' | 'game'
    content_data  JSON           -- lesson body, quiz questions, or game config
);
```

#### Sample content row (quiz):

```sql
INSERT INTO educational_content
  (class_level, subject, chapter_name, activity_type, content_data)
VALUES (
  '6th', 'Mathematics', 'Fractions Introduction', 'quiz',
  '{
    "questions": [
      {
        "q": "What is 1/2 + 1/2?",
        "options": ["1", "2", "1/4", "3/4"],
        "answer": "1"
      }
    ]
  }'
);
```

#### Sample content row (notes):

```sql
INSERT INTO educational_content
  (class_level, subject, chapter_name, activity_type, content_data)
VALUES (
  '6th', 'Mathematics', 'Introduction to Fractions', 'notes',
  '{
    "body": "<h3>What is a Fraction?</h3><p>A fraction represents a part of a whole...</p>"
  }'
);
```

---

### 3. Clone & Install

```bash
git clone <your-repository-link>
cd EDUQUEST
npm install
```

---

### 4. Configure Database Password

Open `BACKEND/config/db.js` and update your MySQL credentials:

```js
const db = mysql.createConnection({
    host:     'localhost',
    user:     'root',
    password: 'YOUR_MYSQL_PASSWORD',   // ← change this
    database: 'eduquest_db'
});
```

---

### 5. Run the Server

```bash
node app.js
```

```
╔══════════════════════════════════════╗
║  🚀 EduPadhai running on port 3000   ║
║  http://localhost:3000               ║
╚══════════════════════════════════════╝
```

Open your browser and visit **http://localhost:3000**

---

## 🔌 API Reference

### Auth Routes — `/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/signup` | Register a new user |
| `POST` | `/api/login` | Login with email & password |
| `GET`  | `/api/user/:id` | Fetch fresh user data (XP sync) |

### Content Routes — `/api/content`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/content/:class/:subject` | Get all chapters for a class & subject |
| `POST` | `/api/content/progress/update` | Update user XP after activity completion |
| `GET`  | `/api/content/static/about` | Static about page data |
| `GET`  | `/api/content/static/contact` | Static contact page data |

---

## 📖 Usage Guide

1. **Sign Up** — Create a free account with your name, email and phone.
2. **Login** — Sign in to start tracking your progress.
3. **Learn** — Go to *Learn*, select your class (6th–9th), pick a subject, and choose a module.
4. **Complete Activities** — Read notes, take quizzes, or play games to earn XP.
5. **Dashboard** — Check *My Account* to see your XP bar, badges, lessons and quizzes stats.

---

## 🗺️ Roadmap

- [ ] Leaderboard page (top students by XP)
- [ ] Password hashing with bcrypt
- [ ] Session-based auth (express-session / JWT)
- [ ] Offline support / PWA
- [ ] Read Aloud (text-to-speech) for accessibility
- [ ] Admin panel to add/edit content without SQL

---

## 🤝 Contributing

Pull requests are welcome! For major changes please open an issue first.

1. Fork the repository
2. Create your feature branch — `git checkout -b feature/your-feature`
3. Commit your changes — `git commit -m 'Add some feature'`
4. Push to the branch — `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">
  <strong>Built with ❤️ for rural students across India 🇮🇳</strong>
</div>