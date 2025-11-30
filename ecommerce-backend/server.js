// server.js
const express = require('express');
const cors = require('cors');
const path = require('path'); 
const verificarToken = require('./authMiddleware');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());


// Rutas públicas
app.use('/public', express.static(path.join(__dirname, 'data')));
app.use(require('./auth'));

// Ruta protegida
app.get('/productos-protegidos', verificarToken, (req, res) => {
    res.json({
        message: "Acceso permitido",
        user: req.user, // Info del usuario tomada del token
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
