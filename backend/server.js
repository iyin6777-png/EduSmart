const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const dbDir = path.join(__dirname, 'data');
const dbPath = path.join(dbDir, 'edusmart.db');

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

const dashboardTemplate = {
  user: {
    name: 'Aisha Bello',
    email: 'aisha@edusmart.edu',
    level: 'Level 300',
  },
  courses: [
    { id: 1, title: 'Advanced Mathematics', subject: 'STEM', progress: 82, lessons: '8/10 lessons', next: 'Trigonometric identities' },
    { id: 2, title: 'Biology Essentials', subject: 'Science', progress: 68, lessons: '6/9 lessons', next: 'Genetics workshop' },
    { id: 3, title: 'World History', subject: 'Humanities', progress: 91, lessons: '10/11 lessons', next: 'Civil rights timeline' },
  ],
  activities: [
    { label: 'Completed Algebra II quiz', time: '2 hours ago' },
    { label: 'Reviewed Biology chapter summary', time: 'Yesterday' },
    { label: 'Submitted Physics lab report', time: '2 days ago' },
  ],
  assignments: [
    { title: 'Economics Case Study', due: 'Due tomorrow, 5:00 PM', status: 'Pending' },
    { title: 'Chemistry Lab Write-up', due: 'Due Friday, 12:00 PM', status: 'In progress' },
    { title: 'Literature Reflection', due: 'Due next Monday', status: 'Upcoming' },
  ],
  performance: [
    { subject: 'Mathematics', score: 94 },
    { subject: 'English', score: 88 },
    { subject: 'Biology', score: 90 },
    { subject: 'Physics', score: 86 },
  ],
  exams: [
    { title: 'Mock CBT – Mathematics', date: '12 Nov 2026', status: 'Ready' },
    { title: 'AI Tutor Revision Sprint', date: '15 Nov 2026', status: 'Scheduled' },
  ],
};

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'edusmart-secret-key-change-me', {
    expiresIn: '7d',
  });
};

const getUserFromToken = (authHeader) => {
  if (!authHeader) return null;

  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'edusmart-secret-key-change-me');
  } catch (error) {
    return null;
  }
};

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'EduSmart API' });
});

app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
  if (existing) {
    return res.status(409).json({ message: 'An account with this email already exists.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = db.prepare(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)'
  ).run(name.trim(), email.toLowerCase().trim(), passwordHash);

  const created = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(user.lastInsertRowid);
  const token = generateToken(created);

  return res.status(201).json({
    message: 'Account created successfully',
    token,
    user: { id: created.id, name: created.name, email: created.email },
  });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
  if (!user) {
    return res.status(401).json({ message: 'Invalid email address or password.' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email address or password.' });
  }

  const token = generateToken(user);
  return res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

app.get('/api/dashboard', (req, res) => {
  const decoded = getUserFromToken(req.headers.authorization);

  if (!decoded) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  const user = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(decoded.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const dashboard = { ...dashboardTemplate, user: { ...dashboardTemplate.user, name: user.name, email: user.email } };
  return res.json(dashboard);
});

app.listen(port, () => {
  console.log(`EduSmart API listening on http://localhost:${port}`);
});
