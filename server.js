const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.')); // sirve todo el frontend (HTML, CSS, JS, img, etc.)

// =============== RUTAS EXACTAS QUE USA E-MERCADO ===============
app.get('/cats/cat.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'data', 'cats', 'cat.json'));
});

app.get('/sell/publish.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'data', 'sell', 'publish.json'));
});

app.get('/cart/buy.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'data', 'cart', 'buy.json'));
});

// Rutas con ID (ej: /cats_products/101.json, /products/56789.json, etc.)
app.get('/cats_products/:id.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'data', 'cats_products', `${req.params.id}.json`));
});

app.get('/products/:id.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'data', 'products', `${req.params.id}.json`));
});

app.get('/products_comments/:id.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'data', 'products_comments', `${req.params.id}.json`));
});

app.get('/user_cart/:id.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'data', 'user_cart', `${req.params.id}.json`));
});
// ================================================================

app.listen(PORT, () => {
  console.log(`\nServidor local e-mercado corriendo perfectamente`);
  console.log(`http://localhost:${PORT}`);
  console.log(`Todo funciona offline ahora\n`);
});