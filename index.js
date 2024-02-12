const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 9010;

// Create a SQLite database
const db = new sqlite3.Database('users1.db');


db.run(`
CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT
)
`);

db.run(`
CREATE TABLE IF NOT EXISTS submissions(
    id INTEGER PRIMARY KEY,
    name TEXT,
    contact_no TEXT,
    address TEXT,
    message TEXT)
`);

db.run(`
CREATE TABLE IF NOT EXISTS rentinfo(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    tool_name TEXT NOT NULL,
    additional_comments TEXT
)
`);
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));
// Serve HTML form for signup
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public", 'index.html'));
});


app.post('/submit', (req, res) => {
    const { Name, 'Contact no': contactNo, Adress: address, Message: message } = req.body;

    db.run(`
INSERT INTO submissions(name, contact_no, address, message) VALUES( ? , ? , ? , ? )
`, [Name, contactNo, address, message], (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        } else {
            res.send('Form submitted successfully!');
        }
    });
});
// Serve HTML form for signup
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, "public", 'signup.html'));
});

// Handle signup form submission
app.post('/signup', (req, res) => {
    const { username, password } = req.body;

    // Insert user into the database
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err) => {
        if (err) {
            return res.status(500).send('Error creating user');
        }
        res.sendFile(path.join(__dirname, "public", 'login.html'));
    });
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, "public", 'login.html'));
});

app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, "public", 'Chat.html'));
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
            res.sendFile(path.join(__dirname, "public", 'index.html'));
        } else {
            res.send('Invalid username or password');
        }
    });
});


app.get('/rent', (req, res) => {
    res.sendFile(path.join(__dirname, "public", 'rentinfo.html'));
});
app.post('/rent', (req, res) => {
    const { name, email, phone, date, time, tool_name, additional_comments } = req.body;

    // Insert user into the database
    db.run('INSERT INTO rentinfo (name, email, phone, date, time, tool_name, additional_comments) VALUES (?, ?, ?, ?, ?, ?, ?)', [name, email, phone, date, time, tool_name, additional_comments], (err, row) => {

        if (err) {
            res.sendFile(path.join(__dirname, "public", 'index.html'));
        }
        res.sendFile(path.join(__dirname, "public", 'index.html'));
    });
});
app.listen(port, () => {
    console.log(`
Server is running at http://localhost:${port}`);
});