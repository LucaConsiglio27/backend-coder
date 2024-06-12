const express = require('express');

const createViewsRouter = (productsManager) => {
    const router = express.Router();

    router.get('/', async (req, res) => {
        try {
            const products = await productsManager.getAllProducts();
            res.render('home', { products });
        } catch (err) {
            res.status(500).send('Error loading products');
        }
    });

    router.get('/realtimeproducts', async (req, res) => {
        try {
            const products = await productsManager.getAllProducts();
            res.render('realTimeProducts', { products });
        } catch (err) {
            res.status(500).send('Error loading products');
        }
    });

    return router;
};

module.exports = createViewsRouter;
