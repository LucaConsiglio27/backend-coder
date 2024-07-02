const express = require('express');
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');
const exphbs = require('express-handlebars');

const app = express();
const server = createServer(app);
const io = new Server(server);

// Routers
const productRouter = require('./src/routes/products');
const viewsRouter = require('./src/routes/views');

// Handlebars setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src/views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use Routers
app.use('/api/products', productRouter);
app.use('/', viewsRouter);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// WebSocket connection
io.on('connection', async (socket) => {
    try {
        const productsManager = new ProductsManager(path.join(__dirname, 'src/data/products.json'));
        const products = await productsManager.getAll();
        socket.emit('getProducts', products);
    } catch (err) {
        console.error('Error getting products:', err);
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
