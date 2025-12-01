// db/connection.js
const mysql = require('mysql2');

// Create MySQL connection using .env variables
const connection = mysql.createConnection({
  host: process.env.DB_HOST,       // Aiven host
  user: process.env.DB_USER,       // Aiven username
  password: process.env.DB_PASS,   // Aiven password
  database: process.env.DB_NAME,   // Aiven database name
  port: process.env.DB_PORT || 19584,
  ssl: {
    rejectUnauthorized: false // Aiven self-signed SSL certificate
  }
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Database connection failed ❌:', err);
  } else {
    console.log('Connected to MySQL database ✅');
  }
});

module.exports = connection;
