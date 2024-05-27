// routes/products.js
const express = require('express');
const fs = require('fs');
const generateId = require('../utils/generateId');
const errorHandler = require('../utils/errorHandler');

const router = express.Router();
const productosFile = require('path').join(__dirname, '..', 'productos.json');

router.get('/', (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    fs.readFile(productosFile, (err, data) => {
        if (err) return errorHandler(err, res);
        const productos = JSON.parse(data);
        if (limit) {
            res.json(productos.slice(0, limit));
        } else {
            res.json(productos);
        }
    });
});

router.get('/:pid', (req, res) => {
    const pid = req.params.pid;
    fs.readFile(productosFile, (err, data) => {
        if (err) return errorHandler(err, res);
        const productos = JSON.parse(data);
        const product = productos.find(p => p.id === pid);
        if (product) {
            res.json(product);
        } else {
            res.status(404).send('Product not found');
        }
    });
});

router.post('/', (req, res) => {
    const newProduct = req.body;
    newProduct.id = generateId();
    fs.readFile(productosFile, (err, data) => {
        if (err) return errorHandler(err, res);
        const productos = JSON.parse(data);
        productos.push(newProduct);
        fs.writeFile(productosFile, JSON.stringify(productos), err => {
            if (err) return errorHandler(err, res);
            res.json(newProduct);
        });
    });
});

router.put('/:pid', (req, res) => {
    const pid = req.params.pid;
    const updatedProduct = req.body;
    fs.readFile(productosFile, (err, data) => {
        if (err) return errorHandler(err, res);
        let productos = JSON.parse(data);
        const index = productos.findIndex(p => p.id === pid);
        if (index !== -1) {
            productos[index] = { ...productos[index], ...updatedProduct, id: pid };
            fs.writeFile(productosFile, JSON.stringify(productos), err => {
                if (err) return errorHandler(err, res);
                res.json(productos[index]);
            });
        } else {
            res.status(404).send('Product not found');
        }
    });
});

router.delete('/:pid', (req, res) => {
    const pid = req.params.pid;
    fs.readFile(productosFile, (err, data) => {
        if (err) return errorHandler(err, res);
        let productos = JSON.parse(data);
        const index = productos.findIndex(p => p.id === pid);
        if (index !== -1) {
            productos.splice(index, 1);
            fs.writeFile(productosFile, JSON.stringify(productos), err => {
                if (err) return errorHandler(err, res);
                res.status(204).send();
            });
        } else {
            res.status(404).send('Product not found');
        }
    });
});

module.exports = router;
