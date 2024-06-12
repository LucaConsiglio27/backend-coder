const express = require('express');
const fs = require('fs');
const path = require('path');
const generateId = require('../utils/generateId.js');
const errorHandler = require('../utils/errorHandler.js');

// Clase para manejar productos
class ProductsManager {
    constructor(filePath) {
        this.filePath = filePath;
    }

    // Obtener todos los productos
    async getAll() {
        const data = await fs.promises.readFile(this.filePath, 'utf-8');
        return JSON.parse(data);
    }

    // Obtener producto por ID
    async getById(id) {
        const products = await this.getAll();
        return products.find(p => p.id === id);
    }

    // Crear nuevo producto
    async create(productData) {
        const products = await this.getAll();
        const newProduct = { id: generateId(), ...productData, status: true };
        products.push(newProduct);
        await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2));
        return newProduct;
    }

    // Actualizar producto existente
    async update(id, updatedData) {
        const products = await this.getAll();
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = { ...products[index], ...updatedData, id };
            await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2));
            return products[index];
        }
        throw new Error('Product not found');
    }

    // Eliminar producto por ID
    async delete(id) {
        const products = await this.getAll();
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products.splice(index, 1);
            await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2));
            return;
        }
        throw new Error('Product not found');
    }
}

// Crear router para manejar rutas de productos
const createProductsRouter = (filePath, io) => {
    const router = express.Router();
    const productsManager = new ProductsManager(filePath);

    // Obtener todos los productos o un número limitado
    router.get('/', async (req, res) => {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
            const products = await productsManager.getAll();
            res.json(limit ? products.slice(0, limit) : products);
        } catch (err) {
            errorHandler(err, res);
        }
    });

    // Obtener producto por ID
    router.get('/:pid', async (req, res) => {
        try {
            const product = await productsManager.getById(req.params.pid);
            if (product) {
                res.json(product);
            } else {
                res.status(404).send('Product not found');
            }
        } catch (err) {
            errorHandler(err, res);
        }
    });

    // Crear nuevo producto
    router.post('/', async (req, res) => {
        try {
            const { title, description, code, price, stock, category, thumbnails = [] } = req.body;
            if (!title || !description || !code || price == null || stock == null || !category) {
                return res.status(400).send('Missing required fields');
            }
            const newProduct = await productsManager.create({ title, description, code, price, stock, category, thumbnails });
            io.emit('productAdded', newProduct); // Emitir evento de WebSocket
            res.json(newProduct);
        } catch (err) {
            errorHandler(err, res);
        }
    });

    // Actualizar producto existente
    router.put('/:pid', async (req, res) => {
        try {
            const updatedProduct = await productsManager.update(req.params.pid, req.body);
            io.emit('productUpdated', updatedProduct); // Emitir evento de WebSocket
            res.json(updatedProduct);
        } catch (err) {
            errorHandler(err, res);
        }
    });

    // Eliminar producto por ID
    router.delete('/:pid', async (req, res) => {
        try {
            await productsManager.delete(req.params.pid);
            io.emit('productDeleted', req.params.pid); // Emitir evento de WebSocket
            res.status(204).send();
        } catch (err) {
            errorHandler(err, res);
        }
    });

    return router;
};

// Exportar el router y la clase ProductsManager
module.exports = createProductsRouter;
module.exports.ProductsManager = ProductsManager;
