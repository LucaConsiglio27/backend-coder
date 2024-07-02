const express = require('express');
const path = require('path');
const ProductsManager = require('../managers/ProductsManager');
const router = express.Router();

const productsManager = new ProductsManager(path.join(__dirname, '../data/products.json'));

// Ruta para obtener todos los productos y renderizar la vista 'home'
router.get('/', async (req, res) => {
    try {
        const products = await productsManager.getAll();
        res.render('home', { layout: false, products });
    } catch (err) {
        res.status(500).send('Error retrieving products');
    }
});

// Ruta para obtener productos en tiempo real y renderizar la vista 'realTimeProducts'
router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { layout: false });
});

module.exports = router;
