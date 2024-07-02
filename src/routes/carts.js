// src/routes/carts.js
const express = require('express');
const { Cart } = require('../models');
const router = express.Router();

router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    try {
        await Cart.updateOne({ _id: cid }, { $pull: { products: { product: pid } } });
        res.json({ status: 'success' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;

    try {
        await Cart.updateOne({ _id: cid }, { products });
        res.json({ status: 'success' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        await Cart.updateOne({ _id: cid, 'products.product': pid }, { $set: { 'products.$.quantity': quantity } });
        res.json({ status: 'success' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        await Cart.updateOne({ _id: cid }, { $set: { products: [] } });
        res.json({ status: 'success' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

router.get('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await Cart.findById(cid).populate('products.product');
        res.json({ status: 'success', payload: cart.products });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

module.exports = router;
