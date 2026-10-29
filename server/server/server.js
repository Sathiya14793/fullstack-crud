// server/server.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

// cors lets your React frontend (port 5173) talk to this backend (port 5000)
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',            // Default PostgreSQL user
  host: 'localhost',           // Running on your local machine
  database: 'crud_db',         // The database name you created in pgAdmin
  password: 'admin123',   // <-- Replace with your PostgreSQL password
  port: 5432                   // Default PostgreSQL port
});
pool.connect((err) => {
  if (err) {
    console.error('Database connection error:', err.stack);
  } else {
    console.log('Connected to PostgreSQL (crud_db) successfully!');
  }
});


// A simple list of users stored right here in JavaScript
let users = [
  { id: 1, name: 'Alice', email: 'alice@example.com', role: 'Developer' },
  { id: 2, name: 'Bob', email: 'bob@example.com', role: 'Designer' }
];

// When someone visits http://localhost:5000/api/users, send them the list
app.get('/api/users', async (req, res) => {
 try {
    const result = await pool.query('SELECT * FROM users ORDER BY id ASC');
    res.json(result.rows); // result.rows contains the array of users
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error while fetching users' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { name, email, role } = req.body;

    // $1, $2, $3 safely inject variables to prevent SQL injection
    // RETURNING * gives back the newly created row (including its auto-generated id)
    const result = await pool.query(
      'INSERT INTO users (name, email, role) VALUES ($1, $2, $3) RETURNING *',
      [name, email, role]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error while adding user' });
  }
});
app.put('/api/users/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, email, role } = req.body;

    const result = await pool.query(
      'UPDATE users SET name = $1, email = $2, role = $3 WHERE id = $4 RETURNING *',
      [name, email, role, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error while updating user' });
  }
});

// 4. DELETE (Remove user by ID)
app.delete('/api/users/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error while deleting user' });
  }
});

app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});