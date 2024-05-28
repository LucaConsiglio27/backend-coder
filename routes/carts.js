const express = require('express'); 
// Importa el modulo express para manejar las rutas y las solicitudes HTTP.

const fs = require('fs'); 
// Importa el modulo fs (file system) para leer y escribir archivos.

const path = require('path'); 
// Importa el modulo path para trabajar con rutas de archivos.

const generateId = require('../utils/generateId'); 
// Importa una funcion personalizada para generar IDs unicos.

const errorHandler = require('../utils/errorHandler'); 
// Importa una funcion personalizada para manejar errores.

const createCartsRouter = (carritosFile) => { 
    // Define una funcion que crea y devuelve un router configurado.

    const router = express.Router(); 
    // Crea una nueva instancia de un router de Express.

    router.post('/', (req, res) => { 
        // Define una ruta POST para crear un nuevo carrito.

        const nuevoCarrito = { 
            id: generateId(), 
            // Genera un nuevo ID para el carrito.
            
            products: [] 
            // Inicializa el carrito con una lista vacia de productos.
        };

        fs.readFile(carritosFile, (err, data) => { 
            // Lee el archivo que contiene los carritos.

            if (err) return errorHandler(err, res); 
            // Si hay un error al leer el archivo, maneja el error.

            const carritos = JSON.parse(data); 
            // Convierte los datos del archivo de JSON a un objeto JavaScript.

            carritos.push(nuevoCarrito); 
            // Agrega el nuevo carrito a la lista de carritos.

            fs.writeFile(carritosFile, JSON.stringify(carritos), err => { 
                // Escribe la lista actualizada de carritos de vuelta al archivo.

                if (err) return errorHandler(err, res); 
                // Si hay un error al escribir el archivo, maneja el error.

                res.json(nuevoCarrito); 
                // Devuelve el nuevo carrito como respuesta JSON.
            });
        });
    });

    router.get('/:cid', (req, res) => { 
        // Define una ruta GET para obtener un carrito por su ID.

        const cid = req.params.cid; 
        // Obtiene el ID del carrito de los parametros de la URL.

        fs.readFile(carritosFile, (err, data) => { 
            // Lee el archivo que contiene los carritos.

            if (err) return errorHandler(err, res); 
            // Si hay un error al leer el archivo, maneja el error.

            const carritos = JSON.parse(data); 
            // Convierte los datos del archivo de JSON a un objeto JavaScript.

            const carrito = carritos.find(c => c.id === cid); 
            // Busca el carrito con el ID especificado.

            if (carrito) { 
                res.json(carrito); 
                // Si se encuentra el carrito, lo devuelve como respuesta JSON.
            } else { 
                res.status(404).send('Cart not found'); 
                // Si no se encuentra el carrito, devuelve un error 404.
            }
        });
    });

    router.post('/:cid/product/:pid', (req, res) => { 
        // Define una ruta POST para agregar un producto a un carrito.

        const cid = req.params.cid; 
        // Obtiene el ID del carrito de los parametros de la URL.

        const pid = req.params.pid; 
        // Obtiene el ID del producto de los parametros de la URL.

        fs.readFile(carritosFile, (err, data) => { 
            // Lee el archivo que contiene los carritos.

            if (err) return errorHandler(err, res); 
            // Si hay un error al leer el archivo, maneja el error.

            let carritos = JSON.parse(data); 
            // Convierte los datos del archivo de JSON a un objeto JavaScript.

            const carritoIndex = carritos.findIndex(c => c.id === cid); 
            // Busca el indice del carrito con el ID especificado.

            if (carritoIndex !== -1) { 
                const carrito = carritos[carritoIndex]; 
                // Si se encuentra el carrito, lo obtiene.

                const productIndex = carrito.products.findIndex(p => p.product === pid); 
                // Busca el indice del producto en la lista de productos del carrito.

                if (productIndex !== -1) { 
                    carrito.products[productIndex].quantity++; 
                    // Si el producto ya esta en el carrito, incrementa su cantidad.
                } else { 
                    carrito.products.push({ product: pid, quantity: 1 }); 
                    // Si el producto no esta en el carrito, lo agrega con una cantidad de 1.
                }

                fs.writeFile(carritosFile, JSON.stringify(carritos), err => { 
                    // Escribe la lista actualizada de carritos de vuelta al archivo.

                    if (err) return errorHandler(err, res); 
                    // Si hay un error al escribir el archivo, maneja el error.

                    res.json(carritos[carritoIndex]); 
                    // Devuelve el carrito actualizado como respuesta JSON.
                });
            } else { 
                res.status(404).send('Cart not found'); 
                // Si no se encuentra el carrito, devuelve un error 404.
            }
        });
    });

    return router; 
    // Devuelve el router configurado.
};

module.exports = createCartsRouter; 
// Exporta la funcion para que pueda ser utilizada en otros archivos.
