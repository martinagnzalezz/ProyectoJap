const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const USUARIO_DE_PRUEBA = {
    username: 'admin',
    password: '1234'
};

const SECRET_KEY = 'clave123';

// Ruta de login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Faltan datos de usuario o contraseña' });
    }

    if (username === USUARIO_DE_PRUEBA.username && password === USUARIO_DE_PRUEBA.password) {
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1m' });
        return res.json({ message: 'Login exitoso', token });
    }

    return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
});

module.exports = router;
