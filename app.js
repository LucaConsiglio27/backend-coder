// En app.js

const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const { createServer } = require('http');
const { Server } = require('socket.io');
const createProductsRouter = require('./routes/products');
const createCartsRouter = require('./routes/carts');
const ProductsManager = require('./routes/products').ProductsManager;
const errorHandler = require('./utils/errorHandler');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Configuración de Handlebars
const hbs = exphbs.create({
    extname: '.handlebars'
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
const productsRouter = createProductsRouter(path.join(__dirname, 'data/products.json'), io);
const cartsRouter = createCartsRouter(path.join(__dirname, 'data/carts.json'));
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Obtener todos los productos
app.get('/', (req, res) => res.render('home', { layout: false }));
app.get('/realtimeproducts', async (req, res) => {
    try {
        const productsManager = new ProductsManager(path.join(__dirname, 'data/products.json'));
        const products = await productsManager.getAll();
        res.render('realTimeProducts', { layout: false, products });
    } catch (err) {
        console.error('Error getting products:', err);
        res.status(500).send('Internal Server Error');
    }
});

// WebSocket connection
io.on('connection', async (socket) => {
    try {
        const productsManager = new ProductsManager(path.join(__dirname, 'data/products.json'));
        const products = await productsManager.getAll();
        socket.emit('getProducts', products);
    } catch (err) {
        console.error('Error getting products:', err);
    }
});

// Manejo de errores
app.use((err, req, res, next) => errorHandler(err, res));

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
