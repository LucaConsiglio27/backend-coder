// src/routes/views.js
const express = require('express');
const { Product, Cart } = require('../models');
const router = express.Router();

router.get('/products', async (req, res) => {
    const { limit = 10, page = 1, sort, query } = req.query;
    const filter = query ? { $or: [{ category: query }, { available: query === 'true' }] } : {};

    try {
        const products = await Product.find(filter)
            .limit(parseInt(limit))
            .skip((page - 1) * limit)
            .sort(sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {});

        const totalProducts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limit);
        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;

        res.render('home', {
            products,
            totalPages,
            prevPage: hasPrevPage ? page - 1 : null,
            nextPage: hasNextPage ? page + 1 : null,
            page: parseInt(page),
            hasPrevPage,
            hasNextPage,
            prevLink: hasPrevPage ? `/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
            nextLink: hasNextPage ? `/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
        });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

router.get('/products/:pid', async (req, res) => {
    const { pid } = req.params;

    try {
        const product = await Product.findById(pid);
        res.render('productDetails', { product });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

router.get('/carts/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await Cart.findById(cid).populate('products.product');
        res.render('cart', { cart });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

module.exports = router;
