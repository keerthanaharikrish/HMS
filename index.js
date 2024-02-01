const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Create a SQLite database
const db = new sqlite3.Database('users.db');

// Create users table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT
  )
`);

app.use(bodyParser.urlencoded({ extended: true }));


// Serve HTML form for signup
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public",'index.html'));
  });
// Serve HTML form for signup
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname,"public", 'signup.html'));
  });

// Handle signup form submission
app.post('/signup', (req, res) => {
  const { username, password } = req.body;

  // Insert user into the database
  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err) => {
    if (err) {
      return res.status(500).send('Error creating user');
    }
    res.send('User created successfully');
  });
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname,"public", 'login.html'));
  });
// Handle login form submission
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if user exists in the database
  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
    if (err) {
      return res.status(500).send('Error checking user');
    }

    if (row) {
      res.send('Login successful');
    } else {
      res.send('Invalid username or password');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
