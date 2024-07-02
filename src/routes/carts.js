// Importar módulos necesarios
const express = require('express');
const generateId = require('../../utils/generateId.js'); // Función para generar IDs únicos
const errorHandler = require('../../utils/errorHandler.js'); // Manejador de errores

// Función para crear el enrutador de carritos
const createCartsRouter = (cartsManager) => {
    const router = express.Router();

    // Ruta para crear un nuevo carrito
    router.post('/', async (req, res) => {
        try {
            const nuevoCarrito = { id: generateId(), products: [] }; // Crear un nuevo carrito con un ID único y sin productos
            const addedCart = await cartsManager.addCart(nuevoCarrito); // Agregar el nuevo carrito usando el manejador de carritos
            res.json(addedCart); // Responder con el carrito agregado
        } catch (err) {
            errorHandler(err, res); // Manejar errores
        }
    });

    // Ruta para obtener un carrito por ID
    router.get('/:cid', async (req, res) => {
        try {
            const cart = await cartsManager.getCartById(req.params.cid); // Obtener el carrito por ID usando el manejador de carritos
            if (cart) {
                res.json(cart); // Responder con el carrito si se encuentra
            } else {
                res.status(404).send('Cart not found'); // Responder con un error 404 si no se encuentra el carrito
            }
        } catch (err) {
            errorHandler(err, res); // Manejar errores
        }
    });

    // Ruta para agregar un producto a un carrito
    router.post('/:cid/product/:pid', async (req, res) => {
        try {
            const cart = await cartsManager.addProductToCart(req.params.cid, req.params.pid); // Agregar un producto al carrito usando el manejador de carritos
            res.json(cart); // Responder con el carrito actualizado
        } catch (err) {
            errorHandler(err, res); // Manejar errores
        }
    });

    return router;
};

module.exports = createCartsRouter; // Exportar la función para crear el enrutador de carritos
