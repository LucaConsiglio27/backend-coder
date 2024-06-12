const express = require('express');
const generateId = require('../utils/generateId');
const errorHandler = require('../utils/errorHandler');

const createCartsRouter = (cartsManager) => {
    const router = express.Router();

    router.post('/', async (req, res) => {
        try {
            const nuevoCarrito = { id: generateId(), products: [] };
            const addedCart = await cartsManager.addCart(nuevoCarrito);
            res.json(addedCart);
        } catch (err) {
            errorHandler(err, res);
        }
    });

    router.get('/:cid', async (req, res) => {
        try {
            const cart = await cartsManager.getCartById(req.params.cid);
            if (cart) {
                res.json(cart);
            } else {
                res.status(404).send('Cart not found');
            }
        } catch (err) {
            errorHandler(err, res);
        }
    });

    router.post('/:cid/product/:pid', async (req, res) => {
        try {
            const cart = await cartsManager.addProductToCart(req.params.cid, req.params.pid);
            res.json(cart);
        } catch (err) {
            errorHandler(err, res);
        }
    });

    return router;
};

module.exports = createCartsRouter;
