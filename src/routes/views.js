// src/routes/views.js
const express = require('express');
const { Product, Cart } = require('../models');
const router = express.Router();

router.get('/products', async (req, res) => {
    const { limit = 10, page = 1, sort, query } = req.query;
    const filter = query ? { $or: [{ category: query }, { available: query === 'true' }] } : {};
    const sortOptions = sort === 'desc' ? { price: -1 } : { price: 1 };

    try {
        const products = await Product.paginate(filter, { limit, page, sort: sortOptions });
        const totalPages = Math.ceil(products.totalDocs / limit);

        res.render('home', {
            products: products.docs,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/products?limit=${limit}&page=${page - 1}` : null,
            nextLink: products.hasNextPage ? `/products?limit=${limit}&page=${page + 1}` : null,
            page,
            totalPages,
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.render('productDetails', { product });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product');
        if (!cart) {
            return res.status(404).send('Cart not found');
        }
        res.render('cart', { cart });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('realTimeProducts', { products });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
