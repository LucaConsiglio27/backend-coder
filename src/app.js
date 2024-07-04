const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');
const ProductsManager = require('./managers/ProductsManager'); 

const app = express();

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

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
const productsRouter = require('./routes/products.js');
app.use('/api/products', productsRouter);

// Ruta para la página principal
app.get('/', async (req, res) => {
    try {
        const productsManager = new ProductsManager(path.join(__dirname, 'data/products.json'));
        const products = await productsManager.getAll();

        res.render('home', {
            title: 'Tienda de Productos',
            products: products
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta para la página de productos
app.get('/products', async (req, res) => {
    try {
        const productsManager = new ProductsManager(path.join(__dirname, 'data/products.json'));
        const products = await productsManager.getAll();

        res.render('products', {
            title: 'Listado de Productos',
            products: products
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
