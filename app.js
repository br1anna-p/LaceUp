// app.js
require('dotenv').config(); // MUST be first

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const db = require('./db/connection');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// =====================
// ROUTES
// =====================

// Home
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get all products
app.get('/api/products', (req, res) => {
  const query = 'SELECT * FROM products';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

// User registration
app.post('/api/register', (req, res) => {
  const { F_name, L_name, email, password, role } = req.body;
  if (!F_name || !L_name || !email || !password)
    return res.status(400).json({ error: 'Please fill all fields' });

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length > 0) return res.status(400).json({ error: 'Email already registered' });

    const hashedPassword = bcrypt.hashSync(password, 10);
    db.query(
      'INSERT INTO users (F_name, L_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      [F_name, L_name, email, hashedPassword, role || 'customer'],
      (err, result) => {
        if (err) return res.status(500).json({ error: 'Error creating user' });
        res.json({ message: 'User registered successfully!', userId: result.insertId });
      }
    );
  });
});

// User login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Please provide email and password' });

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0) return res.status(401).json({ error: 'Invalid email or password' });

    const user = results[0];
    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful!',
      token,
      user: { id: user.id, F_name: user.F_name, L_name: user.L_name, email: user.email, role: user.role },
    });
  });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).send('Route not found');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
