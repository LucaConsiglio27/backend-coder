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

const createProductsRouter = (productosFile) => { 
    // Define una funcion que crea y devuelve un router configurado.

    const router = express.Router(); 
    // Crea una nueva instancia de un router de Express.

    router.get('/', (req, res) => { 
        // Define una ruta GET para obtener una lista de productos.

        const limit = req.query.limit ? parseInt(req.query.limit) : undefined; 
        // Obtiene el parametro 'limit' de la consulta, si existe, y lo convierte a numero.

        fs.readFile(productosFile, (err, data) => { 
            // Lee el archivo que contiene los productos.

            if (err) return errorHandler(err, res); 
            // Si hay un error al leer el archivo, maneja el error.

            const productos = JSON.parse(data); 
            // Convierte los datos del archivo de JSON a un objeto JavaScript.

            if (limit) { 
                res.json(productos.slice(0, limit)); 
                // Si existe un limite, devuelve solo esa cantidad de productos.
            } else { 
                res.json(productos); 
                // Si no hay limite, devuelve todos los productos.
            }
        });
    });

    router.get('/:pid', (req, res) => { 
        // Define una ruta GET para obtener un producto por su ID.

        const pid = req.params.pid; 
        // Obtiene el ID del producto de los parametros de la URL.

        fs.readFile(productosFile, (err, data) => { 
            // Lee el archivo que contiene los productos.

            if (err) return errorHandler(err, res); 
            // Si hay un error al leer el archivo, maneja el error.

            const productos = JSON.parse(data); 
            // Convierte los datos del archivo de JSON a un objeto JavaScript.

            const product = productos.find(p => p.id === pid); 
            // Busca el producto con el ID especificado.

            if (product) { 
                res.json(product); 
                // Si se encuentra el producto, lo devuelve como respuesta JSON.
            } else { 
                res.status(404).send('Product not found'); 
                // Si no se encuentra el producto, devuelve un error 404.
            }
        });
    });

    router.post('/', (req, res) => { 
        // Define una ruta POST para crear un nuevo producto.

        const { title, description, code, price, stock, category, thumbnails = [] } = req.body; 
        // Obtiene los datos del nuevo producto del cuerpo de la solicitud.

        if (!title || !description || !code || price == null || stock == null || !category) { 
            return res.status(400).send('Missing required fields'); 
            // Si faltan campos requeridos, devuelve un error 400.
        }

        const newProduct = { 
            id: generateId(), 
            // Genera un nuevo ID para el producto.

            title, 
            description, 
            code, 
            price, 
            status: true, 
            stock, 
            category, 
            thumbnails 
            // Crea un nuevo objeto de producto con los datos proporcionados.
        };

        fs.readFile(productosFile, (err, data) => { 
            // Lee el archivo que contiene los productos.

            if (err) return errorHandler(err, res); 
            // Si hay un error al leer el archivo, maneja el error.

            const productos = JSON.parse(data); 
            // Convierte los datos del archivo de JSON a un objeto JavaScript.

            productos.push(newProduct); 
            // Agrega el nuevo producto a la lista de productos.

            fs.writeFile(productosFile, JSON.stringify(productos), err => { 
                // Escribe la lista actualizada de productos de vuelta al archivo.

                if (err) return errorHandler(err, res); 
                // Si hay un error al escribir el archivo, maneja el error.

                res.json(newProduct); 
                // Devuelve el nuevo producto como respuesta JSON.
            });
        });
    });

    router.put('/:pid', (req, res) => { 
        // Define una ruta PUT para actualizar un producto por su ID.

        const pid = req.params.pid; 
        // Obtiene el ID del producto de los parametros de la URL.

        const updatedProduct = req.body; 
        // Obtiene los datos actualizados del producto del cuerpo de la solicitud.

        fs.readFile(productosFile, (err, data) => { 
            // Lee el archivo que contiene los productos.

            if (err) return errorHandler(err, res); 
            // Si hay un error al leer el archivo, maneja el error.

            let productos = JSON.parse(data); 
            // Convierte los datos del archivo de JSON a un objeto JavaScript.

            const index = productos.findIndex(p => p.id === pid); 
            // Busca el indice del producto con el ID especificado.

            if (index !== -1) { 
                productos[index] = { ...productos[index], ...updatedProduct, id: pid }; 
                // Si se encuentra el producto, lo actualiza con los nuevos datos manteniendo el mismo ID.

                fs.writeFile(productosFile, JSON.stringify(productos), err => { 
                    // Escribe la lista actualizada de productos de vuelta al archivo.

                    if (err) return errorHandler(err, res); 
                    // Si hay un error al escribir el archivo, maneja el error.

                    res.json(productos[index]); 
                    // Devuelve el producto actualizado como respuesta JSON.
                });
            } else { 
                res.status(404).send('Product not found'); 
                // Si no se encuentra el producto, devuelve un error 404.
            }
        });
    });

    router.delete('/:pid', (req, res) => { 
        // Define una ruta DELETE para eliminar un producto por su ID.

        const pid = req.params.pid; 
        // Obtiene el ID del producto de los parametros de la URL.

        fs.readFile(productosFile, (err, data) => { 
            // Lee el archivo que contiene los productos.

            if (err) return errorHandler(err, res); 
            // Si hay un error al leer el archivo, maneja el error.

            let productos = JSON.parse(data); 
            // Convierte los datos del archivo de JSON a un objeto JavaScript.

            const index = productos.findIndex(p => p.id === pid); 
            // Busca el indice del producto con el ID especificado.

            if (index !== -1) { 
                productos.splice(index, 1); 
                // Si se encuentra el producto, lo elimina de la lista de productos.

                fs.writeFile(productosFile, JSON.stringify(productos), err => { 
                    // Escribe la lista actualizada de productos de vuelta al archivo.

                    if (err) return errorHandler(err, res); 
                    // Si hay un error al escribir el archivo, maneja el error.

                    res.status(204).send(); 
                    // Devuelve una respuesta vacia con el codigo de estado 204 (sin contenido).
                });
            } else { 
                res.status(404).send('Product not found'); 
                // Si no se encuentra el producto, devuelve un error 404.
            }
        });
    });

    return router; 
    // Devuelve el router configurado.
};

module.exports = createProductsRouter; 
// Exporta la funcion para que pueda ser utilizada en otros archivos.
