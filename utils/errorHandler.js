function errorHandler(err, res) { 
    // Define una funcion llamada errorHandler que toma dos parametros: err y res.

    console.error(err); 
    // Muestra el error en la consola.

    res.status(500).send('Internal Server Error'); 
    // Establece el codigo de estado de la respuesta en 500 (Error Interno del Servidor) y envia un mensaje de error.
}

module.exports = errorHandler; 
// Exporta la funcion para que pueda ser utilizada en otros archivos.
