const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',      // escribe aqui tu usuario de MariaDB
  password: '',      // escribe aqui tu pass de MariaDB
  database: 'ecommerce'
});

module.exports = pool;