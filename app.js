// ================== app.js ==================
// Import dependencies
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ================== MIDDLEWARE ==================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, JS, images) from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// ================== DATABASE ==================
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// ================== FRONTEND ROUTES ==================
// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cart.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// ================== BACKEND API ROUTES ==================

// User registration
app.post('/register', (req, res) => {
  const { F_name, L_name, email, password, role } = req.body;
  if (!F_name || !L_name || !email || !password) {
    return res.status(400).json({ error: 'Please fill all fields' });
  }

  const checkQuery = `SELECT * FROM users WHERE email = ?`;
  db.query(checkQuery, [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length > 0) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = bcrypt.hashSync(password, 10);
    const insertQuery = `
      INSERT INTO users (F_name, L_name, email, password_hash, role)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(insertQuery, [F_name, L_name, email, hashedPassword, role || 'customer'], (err, result) => {
      if (err) return res.status(500).json({ message: 'Error creating user' });
      res.json({ message: 'User registered successfully!', userId: result.insertId });
    });
  });
});

// User login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Provide email and password' });

  const query = `SELECT * FROM users WHERE email = ?`;
  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(401).json({ message: 'Invalid email or password' });

    const user = results[0];
    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1h' });
    res.json({ message: 'Login successful!', token, user: { id: user.id, F_name: user.F_name, L_name: user.L_name, email: user.email, role: user.role } });
  });
});

// Example products API (frontend fetches this)
app.get('/api/products', (req, res) => {
  const sql = 'SELECT * FROM products';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});


// ================== START SERVER ==================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
