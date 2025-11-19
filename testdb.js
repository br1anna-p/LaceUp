const mysql = require('mysql2');

// Replace these with your .env values
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'pev383!',
  database: 'laceup'
});

connection.connect(err => {
  if (err) {
    console.error('Connection failed:', err);
  } else {
    console.log('Connected successfully!');
  }
  connection.end();
});
