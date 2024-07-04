const fs = require('fs').promises;
const path = require('path');

class ProductsManager {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async getAll() {
        try {
            const data = await fs.readFile(this.filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error al leer los productos:', error);
            throw error;
        }
    }
}

module.exports = ProductsManager;
