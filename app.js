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
  const code = req.params.code.toUpperCase();

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
// USER LOGIN (plain text version)
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please provide email and password" });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = results[0];

    // ✅ Plain text comparison since DB stores raw passwords
    if (password !== user.password_hash) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // SUCCESS
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
// PLACE ORDER (fake save for now)
// =====================
app.post("/api/place-order", (req, res) => {
  const { userId, items, total, shippingMethod, address } = req.body;

  // Basic validation
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.json({ success: false, message: "No items in order." });
  }

  // Simulate order ID (since we are not storing in DB)
  const fakeOrderId = Math.floor(Math.random() * 900000) + 100000;

  console.log("ORDER RECEIVED:");
  console.log({ userId, items, total, shippingMethod, address });

  return res.json({
    success: true,
    orderId: fakeOrderId
  });
});

// =============================
// ADMIN ROUTES — REQUIRED
// =============================

// Get ALL discount codes
app.get("/api/discounts", (req, res) => {
  db.query("SELECT * FROM discounts", (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch discounts" });
    res.json(results);
  });
});

// Create a new discount code
app.post("/api/discounts", (req, res) => {
  const { code, amount, type } = req.body;

  if (!code || !amount || !type)
    return res.json({ success: false, message: "Missing fields" });

  db.query(
    "INSERT INTO discounts (code, amount, type, active) VALUES (?, ?, ?, 1)",
    [code, amount, type],
    (err) => {
      if (err) return res.json({ success: false, message: "Error creating discount" });
      res.json({ success: true });
    }
  );
});

// Get ALL orders (history)
app.get("/api/orders", (req, res) => {
  db.query("SELECT * FROM orders ORDER BY order_date DESC", (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch orders" });
    res.json(results);
  });
});

// Delete product
app.delete("/api/products/:id", (req, res) => {
  db.query("DELETE FROM products WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.json({ success: false, message: "Error deleting product" });
    res.json({ success: true });
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
