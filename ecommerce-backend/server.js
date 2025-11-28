const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// Middlewares
app.use(cors());                    // Permite que el frontend se conecte
app.use(express.json());            // Para leer JSON en POST

// Ruta para obtener categorías (público)
app.get('/api/categories', (req, res) => {
  const data = fs.readFileSync(path.join(__dirname, 'data/categories.json'));
  const categories = JSON.parse(data);
  res.json(categories);
});

// Ruta para obtener productos (público por ahora, luego lo protegemos en la parte 4)
app.get('/api/products', (req, res) => {
  const data = fs.readFileSync(path.join(__dirname, 'data/products.json'));
  const products = JSON.parse(data);
  res.json(products);
});

// Ruta para obtener usuarios (solo para pruebas, luego lo usaremos en login)
app.get('/api/users', (req, res) => {
  const data = fs.readFileSync(path.join(__dirname, 'data/users.json'));
  const users = JSON.parse(data);
  res.json(users);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});