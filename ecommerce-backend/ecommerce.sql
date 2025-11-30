-- Crear BD
CREATE DATABASE IF NOT EXISTS ecommerce;
USE ecommerce;

-- CLIENTE
CREATE TABLE cliente (
    id_cliente   INT AUTO_INCREMENT PRIMARY KEY,
    nombre       VARCHAR(100) NOT NULL,
    apellido     VARCHAR(100),
    email        VARCHAR(150) UNIQUE
);

-- CATEGORIA
CREATE TABLE categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre       VARCHAR(100) NOT NULL
);

-- CARRITO  (1 a 1 con CLIENTE)
CREATE TABLE carrito (
    id_carrito   INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente   INT NOT NULL,
    moneda       VARCHAR(10) NOT NULL,
    precio_total DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_carrito_cliente
        FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
    CONSTRAINT uq_carrito_cliente
        UNIQUE (id_cliente)  -- 1 cliente → 1 carrito
);

-- COMPRA  (1 a 1 con CARRITO)
CREATE TABLE compra (
    id_compra   INT AUTO_INCREMENT PRIMARY KEY,
    id_carrito  INT NOT NULL,
    direccion   VARCHAR(255) NOT NULL,
    subtotal    DECIMAL(10,2) NOT NULL,
    codigo      VARCHAR(50) NOT NULL,
    fecha_compra DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_compra_carrito
        FOREIGN KEY (id_carrito) REFERENCES carrito(id_carrito),
    CONSTRAINT uq_compra_carrito
        UNIQUE (id_carrito)  -- 1 carrito → 1 compra
);

-- PRODUCTO  (1 COMPRA tiene N PRODUCTOS)
CREATE TABLE producto (
    id_producto     INT AUTO_INCREMENT PRIMARY KEY,
    codigo          VARCHAR(50) NOT NULL,
    nombre          VARCHAR(150) NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    marca           VARCHAR(100),
    id_categoria    INT,
    id_compra       INT NOT NULL,
    CONSTRAINT fk_prod_categoria
        FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria),
    CONSTRAINT fk_prod_compra
        FOREIGN KEY (id_compra) REFERENCES compra(id_compra)
);
