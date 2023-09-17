const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

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

    db.query('SELECT * FROM users WHERE username = ? and password = ?', [username, passwd], async (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ success: false, message: 'Authentication failed' });
        }

        res.json({ success: true, message: 'Login successful' });

        // const user = results[0];

        // // Compare the provided password with the hashed password stored in the database
        // const passwordMatch = await bcrypt.compare(password, user.password);

        // if (!passwordMatch) {
        //   // Passwords do not match
        //   return res.status(401).json({ success: false, message: 'Authentication failed' });
        // }

        // // Generate a JWT token
        // const token = generateToken(user);

        // // Send the token in the response
        // res.json({ success: true, message: 'Login successful', token });
    });
})



app.post('/signup', async (req, res) => {
    const { username, passwd, email, isAdmin } = req.body;

    db.query('SELECT * FROM users WHERE username = ? OR password = ? or email = ?', [username, passwd, email], async (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        if (results.length > 0) {
            return res.status(409).json({ success: false, message: 'User already exists' });
        }

        // Hash the password
        //   const hashedPassword = await bcrypt.hash(password, 10); // 10 is the saltRounds

        // Insert the user into the database
        db.query('INSERT INTO users (username, password, email, is_admin) VALUES (?, ?, ?, ?)', [username, passwd, email, isAdmin], (error) => {
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



app.listen(8081, () => {
    console.log(`Server is running on port 8081`);
});