require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.get('/', (req, res) => {
  res.send('Projeto em desenvolvimento...');
});

app.get('/users', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM users');
  res.json(rows);
});

app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  const { rows } = await pool.query(
    'INSERT INTO users (id, name, email) VALUES ($1, $2, $3) RETURNING *',
    [uuidv4(), name, email]
  );
  res.status(201).json(rows[0]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
