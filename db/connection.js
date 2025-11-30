// db/connection.js
const mysql = require('mysql2');
require('dotenv').config();

// Create a MySQL connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,       // Aiven host
  port: process.env.DB_PORT,       // Aiven port
  user: process.env.DB_USER,       // Aiven username
  password: process.env.DB_PASS,   // Aiven password
  database: process.env.DB_NAME,   // Database name
  ssl: { rejectUnauthorized: true } // Required for Aiven SSL
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL database ✅');
  }
});

module.exports = connection;
