const express = require('express');
const path = require('path');
const ProductsManager = require('../managers/ProductsManager.js'); // Ajusta la ruta según la ubicación real de ProductsManager

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const productsManager = new ProductsManager(path.join(__dirname, '../data/products.json'));
        const products = await productsManager.getAll();
        
        res.render('home', {
            title: 'Tienda de Productos',
            products: products
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

module.exports = router;
