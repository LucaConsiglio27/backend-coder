const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Configuración de Handlebars
app.engine(
    ".hbs",
    engine({
        defaultLayout: false,
        extname: ".hbs",
    })
);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para parsear JSON y servir archivos estáticos
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
const productsRouter = require('./routes/products');
const viewsRouter = require('./routes/views');
const cartsRouter = require('./routes/carts');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// Manejo de eventos de Socket.IO
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('newProduct', () => {
        io.emit('productListUpdated');
    });

    socket.on('updateProduct', () => {
        io.emit('productListUpdated');
    });

    socket.on('deleteProduct', () => {
        io.emit('productListUpdated');
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
