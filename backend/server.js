const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'task',
});

db.connect((err) => {
    if (err) {
        console.error('Database connection error: ' + err.stack);
        return;
    }
    console.log('Connected to the database');
});

app.post('/login', (req, res) => {
    const { username, passwd, email, isAdmin } = req.body;

    db.query('SELECT * FROM users WHERE username = ? AND email = ? AND is_admin = ?', [username, email, isAdmin], async (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        if (results.length === 0) {
            console.log("Result = 0")
            return res.status(401).json({ success: false, message: 'Authentication failed' });
        }

        const user = results[0];
        console.log(user);

        const passwordMatch = await bcrypt.compare(passwd, user.password);

        // console.log(hashedPassword);
        // console.log(passwd);
        // console.log(user.password);
        // console.log(passwordMatch);

        if (!passwordMatch) {
            console.log("Pwd did not match")
          return res.status(401).json({ success: false, message: 'Authentication failed' });
        }

        res.json({ success: true, message: 'Login successful' });

        // // Generate a JWT token
        // const token = generateToken(user);

        // // Send the token in the response
        // res.json({ success: true, message: 'Login successful', token });
    });
})



app.post('/signup', async (req, res) => {
    const { username, passwd, email, isAdmin } = req.body;

    db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], async (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        if (results.length > 0) {
            return res.status(409).json({ success: false, message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(passwd, 10); // 10 is the saltRounds

        // Insert the user into the database
        db.query('INSERT INTO users (username, password, email, is_admin) VALUES (?, ?, ?, ?)', [username, hashedPassword, email, isAdmin], (error) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ success: false, message: 'Internal server error' });
            }

            // Generate a JWT token for the newly registered user
            // const token = generateToken({ username, email });

            // Send the token in the response
            res.status(201).json({ success: true, message: 'Registration successful' });
        });
    });
});


app.get('/getTasks', async (req, res) => {
    db.query('SELECT * FROM tasks', async (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'No tasks found' });
        }

        res.status(200).json({ success: true, tasks: results });
    });
});


app.listen(8081, () => {
    console.log(`Server is running on port 8081`);
});