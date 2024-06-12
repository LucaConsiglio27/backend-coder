const fs = require('fs').promises;
const path = require('path');

class ProductsManager {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async readFile() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (err) {
            throw new Error('Error reading products file');
        }
    }

    async writeFile(data) {
        try {
            await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
        } catch (err) {
            throw new Error('Error writing products file');
        }
    }

    async getAllProducts() {
        return await this.readFile();
    }

    async getProductById(id) {
        const products = await this.readFile();
        return products.find(p => p.id === id);
    }

    async addProduct(product) {
        const products = await this.readFile();
        products.push(product);
        await this.writeFile(products);
        return product;
    }

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

module.exports = ProductsManager;
