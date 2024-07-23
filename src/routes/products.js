// src/routes/products.js
const express = require('express');
const { Product } = require('../models');
const router = express.Router();

// Crear un nuevo producto (Create)
router.post('/', async (req, res) => {
    const { name, price, category, available } = req.body;
    try {
        const newProduct = new Product({ name, price, category, available });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener todos los productos (Read)
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar un producto (Update)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, price, category, available } = req.body;
    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, { name, price, category, available }, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar un producto (Delete)
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
