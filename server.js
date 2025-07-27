const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // your mysql username
    password: '',      // your mysql password
    database: 'login_app'
});

// Connect to DB
db.connect(err => {
    if (err) throw err;
    console.log('Connected to database.');
});

// Registration endpoint
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
    db.query(sql, [username, hashedPassword], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).send({ message: 'Username already taken.' });
            }
            return res.status(500).send({ message: 'Server error' });
        }
        res.send({ message: 'User registered!' });
    });
});

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [username], (err, results) => {
        if (err) return res.status(500).send({ message: 'Server error' });

        if (results.length === 0) {
            return res.status(400).send({ message: 'User not found.' });
        }

        const user = results[0];

        const passwordIsValid = bcrypt.compareSync(password, user.password);

        if (!passwordIsValid) {
            return res.status(401).send({ message: 'Invalid password.' });
        }

        res.send({ message: 'Login successful!' });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
