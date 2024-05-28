const express = require('express');
const fs = require('fs');
const path = require('path');
const generateId = require('../utils/generateId');
const errorHandler = require('../utils/errorHandler');

const createCartsRouter = (carritosFile) => {
    const router = express.Router();

    router.post('/', (req, res) => {
        const nuevoCarrito = {
            id: generateId(),
            products: []
        };
        fs.readFile(carritosFile, (err, data) => {
            if (err) return errorHandler(err, res);
            const carritos = JSON.parse(data);
            carritos.push(nuevoCarrito);
            fs.writeFile(carritosFile, JSON.stringify(carritos), err => {
                if (err) return errorHandler(err, res);
                res.json(nuevoCarrito);
            });
        });
    });

    router.get('/:cid', (req, res) => {
        const cid = req.params.cid;
        fs.readFile(carritosFile, (err, data) => {
            if (err) return errorHandler(err, res);
            const carritos = JSON.parse(data);
            const carrito = carritos.find(c => c.id === cid);
            if (carrito) {
                res.json(carrito);
            } else {
                res.status(404).send('Cart not found');
            }
        });
    });

    router.post('/:cid/product/:pid', (req, res) => {
        const cid = req.params.cid;
        const pid = req.params.pid;
        fs.readFile(carritosFile, (err, data) => {
            if (err) return errorHandler(err, res);
            let carritos = JSON.parse(data);
            const carritoIndex = carritos.findIndex(c => c.id === cid);
            if (carritoIndex !== -1) {
                const carrito = carritos[carritoIndex];
                const productIndex = carrito.products.findIndex(p => p.product === pid);
                if (productIndex !== -1) {
                    carrito.products[productIndex].quantity++;
                } else {
                    carrito.products.push({ product: pid, quantity: 1 });
                }
                fs.writeFile(carritosFile, JSON.stringify(carritos), err => {
                    if (err) return errorHandler(err, res);
                    res.json(carritos[carritoIndex]);
                });
            } else {
                res.status(404).send('Cart not found');
            }
        });
    });

    return router;
};

module.exports = createCartsRouter;
