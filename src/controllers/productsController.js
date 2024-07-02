const path = require('path');
const ProductsManager = require('../managers/ProductsManager');
const productsManager = new ProductsManager(path.join(__dirname, '../data/products.json'));

const getAllProducts = async (req, res) => {
    try {
        const products = await productsManager.getAll();
        res.json(products);
    } catch (err) {
        res.status(500).send('Error retrieving products');
    }
};

const addProduct = async (req, res) => {
    try {
        const newProduct = await productsManager.add(req.body);
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).send('Error adding product');
    }
};

const deleteProduct = async (req, res) => {
    try {
        await productsManager.delete(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(500).send('Error deleting product');
    }
};

module.exports = {
    getAllProducts,
    addProduct,
    deleteProduct
};
