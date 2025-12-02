// =====================
// app.js
// =====================

// Load environment variables FIRST
require('dotenv').config();

// Import dependencies
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Import database connection AFTER .env is loaded
const db = require('./db/connection');

const app = express();
const PORT = process.env.PORT || 3000;

// =====================
// Middleware
// =====================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // serve HTML, CSS, JS

// =====================
// ROUTES
// =====================

// Home page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// =====================
// GET PRODUCTS (API)
// =====================
app.get('/api/products', (req, res) => {
  const query = 'SELECT * FROM products';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

// =====================
// GET SINGLE PRODUCT BY ID
// =====================
app.get('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  const query = 'SELECT * FROM products WHERE id = ?';
  db.query(query, [productId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(results[0]);
  });
});

// =====================
// GET SIZES FOR A PRODUCT
// =====================
app.get('/api/products/:id/sizes', (req, res) => {
  const productId = req.params.id;
  const query = 'SELECT * FROM product_sizes WHERE product_id = ?';
  db.query(query, [productId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

// =====================
// GET DISCOUNT BY CODE
// =====================
app.get('/api/discount/:code', (req, res) => {
 const code = req.params.code;

  const query = `
    SELECT * FROM discounts 
    WHERE code = ? AND active = TRUE
  `;

  db.query(query, [code], (err, results) => {
    if (err) return res.status(500).json({ success: false });

    if (results.length === 0) {
      return res.json({ success: false }); // invalid or inactive
    }

    res.json({ success: true, discount: results[0] });
  });
});


// =====================
// USER REGISTRATION
// =====================
app.post('/api/register', (req, res) => {
  const { F_name, L_name, email, password, role } = req.body;

  if (!F_name || !L_name || !email || !password)
    return res.status(400).json({ error: 'Please fill all fields' });

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length > 0)
      return res.status(400).json({ error: 'Email already registered' });

    const hashedPassword = bcrypt.hashSync(password, 10);

    const insertQuery = `
      INSERT INTO users (F_name, L_name, email, password_hash, role)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(
      insertQuery,
      [F_name, L_name, email, hashedPassword, role || 'customer'],
      (err, result) => {
        if (err) return res.status(500).json({ error: 'Error creating user' });
        res.json({ message: 'User registered successfully!', userId: result.insertId });
      }
    );
  });
});

// =====================
// USER LOGIN
// =====================
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please provide email and password" });
  }

  // IMPORTANT: table name MUST be `users`
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = results[0];

    // SIMPLE password check (because your DB stores plain passwords)
    if (password !== user.password_hash) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // SUCCESS — respond with user info
    res.json({
      success: true,
      message: "Login successful!",
      user: {
        id: user.id,
        F_name: user.F_name,
        L_name: user.L_name,
        email: user.email,
        role: user.role
      }
    });
  });
});


// =====================
// 404 ROUTE
// =====================
app.use((req, res) => {
  res.status(404).send('Route not found');
});

// =====================
// START SERVER
// =====================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
