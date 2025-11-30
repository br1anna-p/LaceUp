// db/connection.js
const mysql = require('mysql2');
require('dotenv').config(); // just in case

const connection = mysql.createConnection({
  host: process.env.DB_HOST,       // Aiven host
  port: process.env.DB_PORT,       // 19584 from .env
  user: process.env.DB_USER,       // Aiven username
  password: process.env.DB_PASS,   // Aiven password
  database: process.env.DB_NAME,   // Aiven database
  ssl: {
    rejectUnauthorized: true       // required for Aiven SSL
  }
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL database ✅');
  }
});

module.exports = connection;
