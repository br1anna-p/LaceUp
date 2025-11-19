// app.js
require('dotenv').config(); // Load environment variables
const express = require('express');
const path = require('path');
const mysql = require('mysql2'); // or mysql if using that
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from 'public' folder (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL database!');
  }
});

// Route: Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Route: Get all products (example API endpoint)
app.get('/api/products', (req, res) => {
  const sql = 'SELECT * FROM products';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Route: Sample form submission (like login or register)
app.post('/api/users', (req, res) => {
  const { F_name, L_name, email, password_hash } = req.body;
  const sql = 'INSERT INTO users (F_name, L_name, email, password_hash) VALUES (?, ?, ?, ?)';
  db.query(sql, [F_name, L_name, email, password_hash], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User added successfully', id: result.insertId });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Sneaker Store running at http://localhost:${PORT}`);
});
