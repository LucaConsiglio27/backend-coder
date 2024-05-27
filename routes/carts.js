const express = require('express');
const fs = require('fs');
const generateId = require('../generateId'); // Agregado: Importar la función generateId

const router = express.Router(); // Cambiado: "routes" por "router"
const carritosFile = './carritos.json';

router.post('/', (req, res) => {
    const nuevoCarrito = {
        id: generateId(),
        products: []
    };
    fs.readFile(carritosFile, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        const carritos = JSON.parse(data);
        carritos.push(nuevoCarrito);
        fs.writeFile(carritosFile, JSON.stringify(carritos), err => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }
            res.json(nuevoCarrito);
        });
    });
});

// Implementar otras rutas para carritos: GET /:cid, POST /:cid/product/:pid

module.exports = router; // Cambiado: "routes" por "router"
