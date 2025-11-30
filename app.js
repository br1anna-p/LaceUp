// ================= Dependencies =================
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ================= Middleware =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ================= MySQL Connection =================
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

// ================= Routes =================

// GET /products -> fetch all products
app.get('/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

// POST /register -> create a new user
app.post('/register', (req, res) => {
  const { F_name, L_name, email, password, role } = req.body;
  if (!F_name || !L_name || !email || !password) {
    return res.status(400).json({ error: 'Please fill all fields' });
  }

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

// POST /login -> authenticate user
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Please provide email and password' });

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

// GET / -> test route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ================= 404 =================
app.use((req, res) => {
  res.status(404).send('Route not found');
});

// ================= Start Server =================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
