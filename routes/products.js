const express = require('express');
const fs = require('fs');
const path = require('path');
const generateId = require('../utils/generateId');
const errorHandler = require('../utils/errorHandler');

const createProductsRouter = (productosFile) => {
    const router = express.Router();

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
        const { title, description, code, price, stock, category, thumbnails = [] } = req.body;
        if (!title || !description || !code || price == null || stock == null || !category) {
            return res.status(400).send('Missing required fields');
        }
        const newProduct = {
            id: generateId(),
            title,
            description,
            code,
            price,
            status: true,
            stock,
            category,
            thumbnails
        };
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

    return router;
};

module.exports = createProductsRouter;
