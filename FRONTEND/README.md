Gemini said
EduQuest: Gamified Learning Platform for Rural Education
EduQuest is a full-stack, gamified e-learning platform specifically designed to make high-quality education fun, interactive, and accessible for students in rural communities. By combining educational content with game-like elements such as XP points, ranks, and badges, EduQuest encourages consistent learning habits and excitement for discovery.
+2

🚀 Features

Gamified Experience: Earn XP (Experience Points) by completing lessons and quizzes to level up your rank.


Diverse Course Library: Access concept videos, problem-solving guides, and interactive content across Mathematics, Science, Computer Science, and English.


Interactive Learning: Includes a multi-question quiz engine and educational games to test and reinforce knowledge.
+4


Personalized Dashboard: Track your individual progress with real-time stats on completed lessons, quizzes taken, and earned badges.
+1


Accessibility Driven: Tailored for learners in rural areas with features like "Read Aloud" for text-to-speech and optimized assets for low-bandwidth 2G/3G networks.

🛠️ Tech Stack

Frontend: EJS (Embedded JavaScript) Templates, Tailwind CSS (Neo-Brutalist UI), Vanilla JavaScript.
+1


Backend: Node.js, Express.js.
+1

Database: MySQL (relational storage with JSON columns for complex curriculum data).

📂 Project Structure
Following a clean Model-View-Controller (MVC) approach, the project is organized to separate backend logic from the frontend presentation.

Plaintext
SIH---PROJECT/
├── BACKEND/
│   ├── config/
│   │   └── db.js            # MySQL database connection configuration
│   └── routes/
│       ├── auth.js          # API routes for Login, Signup, and User Sync
│       └── content.js       # API routes for Lessons, Quizzes, and Gamification
├── FRONTEND/
│   ├── css/
│   │   └── style.css        # Professional Neo-Brutalist/Gamified styling
│   ├── images/              # Project logos and assets
│   ├── about.ejs            # Platform mission and details
│   ├── activity.ejs         # Dynamic viewer for lessons, quizzes, and games
│   ├── dashboard.ejs        # Personalized user progress and stats
│   ├── header.ejs           # Responsive glassmorphism navigation bar
│   ├── index.ejs            # Platform landing page
│   ├── learn.ejs            # Step-by-step learning path selection
│   ├── login.ejs / signup.ejs # Authentication pages
│   └── help.ejs             # User support and quick start guide
├── app.js                   # Main Express server entry point
├── package.json             # Project dependencies and scripts
└── README.md                # Project documentation
⚙️ Installation & Setup
To run this project locally, follow these steps:

1. Prerequisites
Node.js installed on your machine.

MySQL server running.

2. Database Setup
Execute the following SQL commands in your MySQL Workbench to initialize the database:

SQL
CREATE DATABASE eduquest_db;
USE eduquest_db;

-- Create users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(15),
    password VARCHAR(255),
    points INT DEFAULT 50,
    badges INT DEFAULT 1,
    lessons INT DEFAULT 0,
    quizzesTaken INT DEFAULT 0
);

-- Create content table
CREATE TABLE educational_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_level VARCHAR(10),
    subject VARCHAR(50),
    chapter_name VARCHAR(100),
    activity_type VARCHAR(20),
    content_data JSON
);
3. Clone and Install
Bash
git clone <your-repository-link>
cd SIH---PROJECT
npm install
4. Configuration
Update BACKEND/config/db.js with your MySQL credentials:

JavaScript
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'YOUR_MYSQL_PASSWORD',
    database: 'eduquest_db'
});
5. Run the Application
Bash
node app.js
The server will start at http://localhost:5000.

📜 Usage

Sign Up: Create an account to start tracking your learning journey.
+1


Learn: Navigate to the "Learn" section, select your class and subject, and choose a module to start.
+3


Progress: Check your "My Account" dashboard regularly to see your earned XP and badges