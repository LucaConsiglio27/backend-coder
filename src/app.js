const express = require('express');
const path = require('path');
const app = express();

// Configuración de Handlebars
const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Configuración para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.get('/', async (req, res) => {
    const productsManager = new ProductsManager(path.join(__dirname, 'data/products.json'));
    const products = await productsManager.getAll();

    res.render('home', {
        title: 'Tienda de Productos',
        products: products
    });
});

// Otras rutas y lógica de tu aplicación...

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
