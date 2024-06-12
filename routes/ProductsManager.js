const fs = require('fs').promises;
const path = require('path');

// Clase que gestiona los productos almacenados en un archivo
class ProductsManager {
    constructor(filePath) {
        this.filePath = filePath;
    }

    // Lee el contenido del archivo y lo devuelve como objeto JSON
    async readFile() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (err) {
            // Maneja errores de lectura del archivo
            throw new Error('Error reading products file');
        }
    }

    // Escribe datos en el archivo
    async writeFile(data) {
        try {
            await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
        } catch (err) {
            // Maneja errores de escritura en el archivo
            throw new Error('Error writing products file');
        }
    }

    // Obtiene todos los productos
    async getAllProducts() {
        return await this.readFile();
    }

    // Obtiene un producto por su ID
    async getProductById(id) {
        const products = await this.readFile();
        return products.find(p => p.id === id);
    }

    // Agrega un nuevo producto
    async addProduct(product) {
        const products = await this.readFile();
        products.push(product);
        await this.writeFile(products);
        return product;
    }

    // Actualiza un producto existente por su ID
    async updateProduct(id, updatedProduct) {
        let products = await this.readFile();
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = { ...products[index], ...updatedProduct, id };
            await this.writeFile(products);
            return products[index];
        } else {
            throw new Error('Product not found');
        }
    }
}

// Exporta la clase para que pueda ser utilizada en otros archivos
module.exports = ProductsManager;
