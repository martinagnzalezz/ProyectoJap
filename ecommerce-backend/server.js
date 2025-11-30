// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const verificarToken = require('./authMiddleware');
const pool = require('./db');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// 1) RUTA DE LOGIN (PÚBLICA)
app.use(require('./auth')); // /login

// 2) TODO LO DEMÁS REQUIERE TOKEN
app.use((req, res, next) => {
  if (req.path === '/login') return next();
  return verificarToken(req, res, next);
});

// 3) RUTA DE PRUEBA PARA VER SI EL BACKEND RESPONDE
app.get('/ping', (req, res) => {
  res.json({ status: 'ok', msg: 'backend vivo' });
});

// 4) ENDPOINT POST /cart (usa la BD)
app.post('/cart', async (req, res) => {
  try {
    const { cliente, carrito, compra } = req.body;

    // ---- 1) CLIENTE ----
    const [clienteResult] = await pool.query(
      'INSERT INTO cliente (nombre, apellido, email) VALUES (?, ?, ?)',
      [
        cliente?.nombre || 'sin-nombre',
        cliente?.apellido || null,
        cliente?.email || null
      ]
    );
    const idCliente = clienteResult.insertId;

    // ---- 2) CARRITO ----
    const [carritoResult] = await pool.query(
      'INSERT INTO carrito (id_cliente, moneda, precio_total) VALUES (?, ?, ?)',
      [
        idCliente,
        carrito?.moneda || 'USD',
        carrito?.total || 0
      ]
    );
    const idCarrito = carritoResult.insertId;

    // ---- 3) COMPRA ----
    const [compraResult] = await pool.query(
      'INSERT INTO compra (id_carrito, direccion, subtotal, codigo) VALUES (?, ?, ?, ?)',
      [
        idCarrito,
        compra?.direccion || '',
        compra?.subtotal || 0,
        'ORD-' + Date.now()
      ]
    );
    const idCompra = compraResult.insertId;

    // ---- 4) PRODUCTOS ----
    const items = carrito?.items || [];

    for (const item of items) {
      await pool.query(
        'INSERT INTO producto (codigo, nombre, precio_unitario, marca, id_compra) VALUES (?, ?, ?, ?, ?)',
        [
          String(item.id),
          item.name,
          item.cost,
          item.marca || null,
          idCompra
        ]
      );
    }

    return res.status(201).json({
      message: 'Carrito guardado correctamente',
      idCompra
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al guardar el carrito' });
  }
});

// 5) JSON DEL ECOMMERCE (PROTEGIDOS)
app.use(express.static(path.join(__dirname, 'data')));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
