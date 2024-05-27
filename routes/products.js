const express = require('express');
const fs = require('fs');
const generateId = require('../generateId'); // Agregado: Importar la función generateId

const router = express.Router(); // Cambiado: "routes" por "router"
const productosFile = './productos.json';

router.get('/', (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    fs.readFile(productosFile, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        const productos = JSON.parse(data);
        if (limit) {
            res.json(productos.slice(0, limit));
        } else {
            res.json(productos);
        }
    });
});

// Implementar otras rutas para productos: GET /:pid, POST /, PUT /:pid, DELETE /:pid

router.post('/', (req, res) => {
    const newProduct = req.body;
    newProduct.id = generateId();
    fs.readFile(productosFile, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        const productos = JSON.parse(data);
        productos.push(newProduct);
        fs.writeFile(productosFile, JSON.stringify(productos), err => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }
            res.json(newProduct);
        });
    });
});

// Implementar otras rutas PUT /:pid, DELETE /:pid

module.exports = router; // Cambiado: "routes" por "router"
