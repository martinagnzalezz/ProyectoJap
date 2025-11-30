const jwt = require('jsonwebtoken');

const SECRET_KEY = 'clave123'; // misma clave usada en /login

function verificarToken(req, res, next) {
    const header = req.headers['authorization'];

    // El token se espera en formato: Bearer TOKEN
    if (!header) {
        return res.status(401).json({ message: 'Token no enviado' });
    }

    const token = header.split(' ')[1]; // tomar solo el token

    if (!token) {
        return res.status(401).json({ message: 'Token inválido o faltante' });
    }

    // Validar el token
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token inválido o expirado' });
        }

        // Guardamos la info del token para usarla en las rutas
        req.user = decoded;
        next(); // continuar la ejecución
    });
}

module.exports = verificarToken;
