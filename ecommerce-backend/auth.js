// auth.js
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const router = express.Router();
router.use(bodyParser.json());

// Aquí definimos un usuario de ejemplo
const USUARIO_DE_PRUEBA = {
    username: 'admin',
    password: '1234'
};

// Clave secreta para generar el token
const SECRET_KEY = 'mi_clave_secreta_123';

// Endpoint POST /login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Faltan datos de usuario o contraseña' });
    }

    // Verificamos usuario y contraseña
    if (username === USUARIO_DE_PRUEBA.username && password === USUARIO_DE_PRUEBA.password) {
        // Generamos un token JWT válido por 1 hora
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });

        return res.json({ message: 'Login exitoso', token });
    } else {
        return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }
});

module.exports = router;
