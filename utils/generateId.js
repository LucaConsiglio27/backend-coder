function generateId() { 
    // Define una funcion llamada generateId.

    return '_' + Math.random().toString(36).substr(2, 9); 
    // Genera un ID unico. Primero, genera un numero aleatorio, lo convierte a una cadena en base 36
    // (numeros y letras), y luego toma una subcadena de esa cadena. Finalmente, agrega un guion bajo
    // al inicio de la cadena.
}

module.exports = generateId; 
// Exporta la funcion para que pueda ser utilizada en otros archivos.
