// routes/carts.js
const express = require('express');
const fs = require('fs');
const generateId = require('../utils/generateId');
const errorHandler = require('../utils/errorHandler');

const router = express.Router();
const carritosFile = require('path').join(__dirname, '..', 'carritos.json');

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
        const index = carritos.findIndex(c => c.id === cid);
        if (index !== -1) {
            const existingProduct = carritos[index].products.find(p => p.product === pid);
            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                carritos[index].products.push({ product: pid, quantity: 1 });
            }
            fs.writeFile(carritosFile, JSON.stringify(carritos), err => {
                if (err) return errorHandler(err, res);
                res.json(carritos[index]);
            });
        } else {
            res.status(404).send('Cart not found');
        }
    });
});

module.exports = router;
