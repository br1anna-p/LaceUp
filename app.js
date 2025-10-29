// Import dependencies
const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Create MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS, //from .env
  database: process.env.DB_NAME,
});
// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  }
  else {
    console.log('Connected to MySQL database');
  }
});

// Test route
app.get('/', (req, res) => {
  res.send('Sneaker Store API is running 🚀');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
