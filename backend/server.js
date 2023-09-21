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

        res.json({ success: true, message: 'Login successful', idUser: user.id});
        console.log("Id: ", user.id)

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


app.post('/addTask', async (req, res) => {
    try {
        console.log("New task from backend: ", req.body);
        const { title, description, status, deadline, assignBy, assignTo, tag } = req.body;

        db.query('SELECT * FROM users WHERE id = ?', [assignTo], async (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ success: false, message: 'Error' });
            }
            if (results.length === 0) {
                return res.status(409).json({ success: false, message: 'No such user to assign task to' });
            }})

        db.query(
            'INSERT INTO tasks (title, description, status, deadline, assigned_by, assigned_to, tag) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [title, description, status, deadline, assignBy, assignTo, tag],
            (error, results) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ success: false, message: 'Internal server error' });
                }
                return res.status(200).json({ success: true, message: 'Task added' });
            }
        );
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}) 


app.put('/updateTask/:taskId', async (req, res) => {
    try {
      const { taskId } = req.params;
      const { title, description, deadline, assigned_to, status, tag } = req.body;
  
      // Check if the task with the given taskId exists
      db.query('SELECT * FROM tasks WHERE id = ?', [taskId], async (error, results) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ success: false, message: 'Error' });
        }
  
        if (results.length === 0) {
          return res.status(404).json({ success: false, message: 'Task not found' });
        }
  
        // Update the task data
        db.query(
          'UPDATE tasks SET title = ?, description = ?, deadline = ?, assigned_to = ?, status = ?, tag = ? WHERE id = ?',
          [title, description, deadline, assigned_to, status, tag, taskId],
          (updateError) => {
            if (updateError) {
              console.error(updateError);
              return res.status(500).json({ success: false, message: 'Internal server error' });
            }
  
            return res.status(200).json({ success: true, message: 'Task updated' });
          }
        );
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });
  


  app.get('/getUser/:id', async (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM users WHERE id = ?', [id], async (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'No user found' });
        }

        res.status(200).json({ success: true, users: results });
    });
});


app.put('/updateUser/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { username, password, email } = req.body;
  
      db.query('SELECT * FROM users WHERE id = ?', [id], async (error, results) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ success: false, message: 'Error' });
        }
  
        if (results.length === 0) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }
  
        const hashedPassword = await bcrypt.hash(password, 10);
        // Update the user data
        db.query(
          'UPDATE users SET username = ?, password = ?, email = ? WHERE id = ?',
          [username, hashedPassword, email, id],
          (updateError) => {
            if (updateError) {
              console.error(updateError);
              return res.status(500).json({ success: false, message: 'Internal server error' });
            }
  
            return res.status(200).json({ success: true, message: 'User updated' });
          }
        );
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });
  

////

  app.get('/getUsers', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json({ users: results });
        }
    });
});

app.put('/updateAdminStatus/:userId', (req, res) => {
    const userId = req.params.userId;
    const { isAdmin } = req.body;
    // Update the admin status in the database
    db.query(
        'UPDATE users SET is_admin = ? WHERE id = ?',
        [isAdmin, userId],
        (err, result) => {
            if (err) {
                console.error('Error updating admin status:', err);
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.json({ message: 'Admin status updated successfully' });
            }
        }
    );
});

app.get('/getTaskCounts/:userId', (req, res) => {
    const userId = req.params.userId;

    // Define an object to store task counts
    const taskCounts = {
        assigned: 0,
        inProgress: 0,
        done: 0,
    };

    // Fetch the count of tasks with different statuses for the specified user
    // Use MySQL queries to get the counts
    db.query(
        'SELECT COUNT(*) AS assigned FROM tasks WHERE assigned_to = ? AND status = "Assigned"',
        [userId],
        (err, results) => {
            if (err) {
                console.error('Error fetching assigned task count:', err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            console.log("User: ", userId);
            console.log("Assigned: ", results[0].assigned);
            taskCounts.assigned = results[0].assigned;

            // Fetch the count of tasks in progress
            db.query(
                'SELECT COUNT(*) AS inProgress FROM tasks WHERE assigned_to = ? AND status = "In Progress"',
                [userId],
                (err, results) => {
                    if (err) {
                        console.error('Error fetching in-progress task count:', err);
                        res.status(500).json({ error: 'Internal server error' });
                        return;
                    }
                    console.log("User: ", userId);
                    console.log("In Progress: ", results[0].inProgress);
                    taskCounts.inProgress = results[0].inProgress;

                    // Fetch the count of tasks marked as done
                    db.query(
                        'SELECT COUNT(*) AS done FROM tasks WHERE assigned_to = ? AND status = "Done"',
                        [userId],
                        (err, results) => {
                            if (err) {
                                console.error('Error fetching done task count:', err);
                                res.status(500).json({ error: 'Internal server error' });
                                return;
                            }
                            console.log("User: ", userId);
                            console.log("Done: ", results[0].done);
                            taskCounts.done = results[0].done;

                            console.log("Task counts: ", taskCounts);
                            // Send the task counts as a JSON response
                            res.json(taskCounts);
                        }
                    );
                }
            );
        }
    );
});


app.listen(8081, () => {
    console.log(`Server is running on port 8081`);
});