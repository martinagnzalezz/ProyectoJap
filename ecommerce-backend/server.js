// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());


app.use('/', express.static(path.join(__dirname, 'data')));


app.get('/', (req, res) => {
  res.send('Backend del ecommerce funcionando. Usa las rutas como /products/663.json');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

const authRoutes = require('./auth'); 
app.use(authRoutes);