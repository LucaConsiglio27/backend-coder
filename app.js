const express = require('express');
const createProductsRouter = require('./routes/products');
const createCartsRouter = require('./routes/carts');
const path = require('path');

const app = express();
const PORT = 8080;

app.use(express.json());

const productosFilePath = path.join(__dirname, 'data', 'productos.json');
const carritosFilePath = path.join(__dirname, 'data', 'carritos.json');

app.use('/api/products', createProductsRouter(productosFilePath));
app.use('/api/carts', createCartsRouter(carritosFilePath));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
