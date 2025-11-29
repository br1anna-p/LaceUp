// Import dependencies
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Connect to database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});


// ===============================================
// ✔ USER REGISTRATION ROUTE (FIXED)
// ===============================================
app.post('/register', (req, res) => {
  const { F_name, L_name, email, password, role } = req.body;

  if (!F_name || !L_name || !email || !password) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }

  // Check if email already exists
  const checkQuery = `SELECT * FROM users WHERE email = ?`;

  db.query(checkQuery, [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    if (results.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Insert new user
    const insertQuery = `
      INSERT INTO users (F_name, L_name, email, password_hash, role)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      insertQuery,
      [F_name, L_name, email, hashedPassword, role || 'customer'],
      (err, result) => {
        if (err) return res.status(500).json({ message: 'Error creating user' });

        res.json({
          message: 'User registered successfully!',
          userId: result.insertId,
        });
      }
    );
  });
});


// ===============================================
// ✔ LOGIN ROUTE
// ===============================================
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  const query = `SELECT * FROM users WHERE email = ?`;

  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = results[0];

    // Compare passwords
    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        F_name: user.F_name,
        L_name: user.L_name,
        email: user.email,
        role: user.role,
      },
    });
  });
});


// Test route
app.get('/', (req, res) => {
  res.send('Sneaker Store API is running 🚀');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
