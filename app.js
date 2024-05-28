const express = require('express'); 
// Importa el modulo express para manejar las rutas y las solicitudes HTTP.

const createProductsRouter = require('./routes/products'); 
// Importa la funcion que crea el router de productos.

const createCartsRouter = require('./routes/carts'); 
// Importa la funcion que crea el router de carritos.

const path = require('path'); 
// Importa el modulo path para trabajar con rutas de archivos.

const app = express(); 
// Crea una instancia de una aplicacion de Express.

const PORT = 8080; 
// Define el puerto en el que correra la aplicacion.

app.use(express.json()); 
// Configura la aplicacion para que use middleware que analiza cuerpos de solicitudes JSON.

const productosFilePath = path.join(__dirname, 'data', 'productos.json'); 
// Define la ruta al archivo de productos.

const carritosFilePath = path.join(__dirname, 'data', 'carritos.json'); 
// Define la ruta al archivo de carritos.

app.use('/api/products', createProductsRouter(productosFilePath)); 
// Usa el router de productos en la ruta /api/products, pasandole la ruta del archivo de productos.

app.use('/api/carts', createCartsRouter(carritosFilePath)); 
// Usa el router de carritos en la ruta /api/carts, pasandole la ruta del archivo de carritos.

app.listen(PORT, () => { 
    console.log(`Server is running on port ${PORT}`); 
    // Inicia el servidor en el puerto especificado y muestra un mensaje en la consola.
});

module.exports = app; 
// Exporta la aplicacion para que pueda ser utilizada en otros archivos.
