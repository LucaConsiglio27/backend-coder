const express = require('express');
const path = require('path');
const { create } = require('express-handlebars');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const productsFile = path.join(__dirname, 'data', 'products.json');
const cartsFile = path.join(__dirname, 'data', 'carts.json');

const ProductsManager = require('./routes/ProductsManager');
const CartsManager = require('./routes/CartsManager');
const createProductsRouter = require('./routes/products');
const createCartsRouter = require('./routes/carts');
const createViewsRouter = require('./routes/views');

const productsManager = new ProductsManager(productsFile);
const cartsManager = new CartsManager(cartsFile, productsManager);

// Configurar el motor de plantillas Handlebars
const hbs = create({ extname: '.handlebars' });
app.engine('.handlebars', hbs.engine);
app.set('view engine', '.handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', createProductsRouter(productsManager, io));
app.use('/api/carts', createCartsRouter(cartsManager));
app.use('/', createViewsRouter(productsManager));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
