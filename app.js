// Importa los modulos necesarios
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const { createServer } = require('http');
const { Server } = require('socket.io');
const createProductsRouter = require('./routes/products.js');
const createCartsRouter = require('./routes/carts.js');
const ProductsManager = require('./routes/products.js').ProductsManager;
const errorHandler = require('./utils/errorHandler.js');

// Crea una instancia de Express
const app = express();
// Crea un servidor HTTP
const httpServer = createServer(app);
// Crea una instancia de Socket.io
const io = new Server(httpServer);

// Configuracion de Handlebars
const hbs = exphbs.create({
    extname: '.handlebars' // Define la extension de los archivos de plantilla como .handlebars
});

app.engine('handlebars', hbs.engine); // Establece Handlebars como el motor de plantillas
app.set('view engine', 'handlebars'); // Define Handlebars como el motor de vistas
app.set('views', path.join(__dirname, 'views')); // Define la ruta de las vistas

// Middleware
app.use(express.json()); // Middleware para parsear JSON
app.use(express.urlencoded({ extended: true })); // Middleware para parsear datos URL-encoded
app.use(express.static(path.join(__dirname, 'public'))); // Middleware para servir archivos estaticos

// Rutas
const productsRouter = createProductsRouter(path.join(__dirname, 'data/products.json'), io); // Crea el router de productos
const cartsRouter = createCartsRouter(path.join(__dirname, 'data/carts.json')); // Crea el router de carritos
app.use('/api/products', productsRouter); // Usa el router de productos para rutas /api/products
app.use('/api/carts', cartsRouter); // Usa el router de carritos para rutas /api/carts

// Ruta para obtener todos los productos y renderizar la vista 'home'
app.get('/', (req, res) => res.render('home', { layout: false }));

// Ruta para obtener productos en tiempo real y renderizar la vista 'realTimeProducts'
app.get('/realtimeproducts', async (req, res) => {
    try {
        const productsManager = new ProductsManager(path.join(__dirname, 'data/products.json')); // Crea una instancia de ProductsManager
        const products = await productsManager.getAll(); // Obtiene todos los productos
        res.render('realTimeProducts', { layout: false, products }); // Renderiza la vista con los productos
    } catch (err) {
        console.error('Error getting products:', err); // Imprime el error en la consola
        res.status(500).send('Internal Server Error'); // Responde con un error 500
    }
});

// Conexion WebSocket
io.on('connection', async (socket) => {
    try {
        const productsManager = new ProductsManager(path.join(__dirname, 'data/products.json')); // Crea una instancia de ProductsManager
        const products = await productsManager.getAll(); // Obtiene todos los productos
        socket.emit('getProducts', products); // Emite los productos a los clientes conectados
    } catch (err) {
        console.error('Error getting products:', err); // Imprime el error en la consola
    }
});

// Manejo de errores
app.use((err, req, res, next) => errorHandler(err, res)); // Usa el middleware de manejo de errores

// Configuracion del puerto y arranque del servidor
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`); // Imprime un mensaje en la consola indicando que el servidor esta corriendo
});
