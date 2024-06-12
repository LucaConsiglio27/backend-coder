const express = require('express');
const generateId = require('../utils/generateId');
const errorHandler = require('../utils/errorHandler');

const createProductsRouter = (productsManager, io) => {
    const router = express.Router();

    router.get('/', async (req, res) => {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
            const products = await productsManager.getAllProducts();
            if (limit) {
                res.json(products.slice(0, limit));
            } else {
                res.json(products);
            }
        } catch (err) {
            errorHandler(err, res);
        }
    });

    router.get('/:pid', async (req, res) => {
        try {
            const product = await productsManager.getProductById(req.params.pid);
            if (product) {
                res.json(product);
            } else {
                res.status(404).send('Product not found');
            }
        } catch (err) {
            errorHandler(err, res);
        }
    });

    router.post('/', async (req, res) => {
        try {
            const { title, description, code, price, stock, category, thumbnails = [] } = req.body;
            if (!title || !description || !code || price == null || stock == null || !category) {
                return res.status(400).send('Missing required fields');
            }
            const newProduct = { id: generateId(), title, description, code, price, status: true, stock, category, thumbnails };
            const addedProduct = await productsManager.addProduct(newProduct);
            const products = await productsManager.getAllProducts();
            io.emit('product-update', products);  // Emitimos la actualización de productos
            res.status(201).json(addedProduct);
        } catch (err) {
            errorHandler(err, res);
        }
    });

    router.put('/:pid', async (req, res) => {
        try {
            const updatedProduct = req.body;
            const product = await productsManager.updateProduct(req.params.pid, updatedProduct);
            const products = await productsManager.getAllProducts();
            io.emit('product-update', products);  // Emitimos la actualización de productos
            res.json(product);
        } catch (err) {
            errorHandler(err, res);
        }
    });

    router.delete('/:pid', async (req, res) => {
        try {
            const productId = req.params.pid;
            const products = await productsManager.getAllProducts();
            const index = products.findIndex(p => p.id === productId);
            if (index === -1) {
                return res.status(404).send('Product not found');
            }
            products.splice(index, 1);
            await productsManager.writeFile(products);
            io.emit('product-update', products);  // Emitimos la actualización de productos
            res.status(204).send();
        } catch (err) {
            errorHandler(err, res);
        }
    });

    return router;
};

module.exports = createProductsRouter;

