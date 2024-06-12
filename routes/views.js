const express = require('express');

// Define una funcion para crear el router de vistas, tomando como parametro un objeto productsManager
const createViewsRouter = (productsManager) => {
    const router = express.Router();

    // Define una ruta para la pagina de inicio
    router.get('/', async (req, res) => {
        try {
            // Intenta obtener todos los productos usando productsManager
            const products = await productsManager.getAllProducts();
            // Renderiza la vista 'home' pasando los productos obtenidos
            res.render('home', { products });
        } catch (err) {
            // En caso de error, envia un mensaje de error con el codigo de estado 500
            res.status(500).send('Error loading products');
        }
    });

    // Define una ruta para la pagina de productos en tiempo real
    router.get('/realtimeproducts', async (req, res) => {
        try {
            // Intenta obtener todos los productos usando productsManager
            const products = await productsManager.getAllProducts();
            // Renderiza la vista 'realTimeProducts' pasando los productos obtenidos
            res.render('realTimeProducts', { products });
        } catch (err) {
            // En caso de error, envia un mensaje de error con el codigo de estado 500
            res.status(500).send('Error loading products');
        }
    });

    // Retorna el router configurado
    return router;
};

// Exporta la funcion para que pueda ser utilizada en otros archivos
module.exports = createViewsRouter;
