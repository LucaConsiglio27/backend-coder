const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

class ProductsManager {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async getAll() {
        const data = await fs.readFile(this.filePath, 'utf8');
        return JSON.parse(data);
    }

    async add(product) {
        const products = await this.getAll();
        const newProduct = { id: uuidv4(), ...product };
        products.push(newProduct);
        await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
        return newProduct;
    }

    async delete(productId) {
        let products = await this.getAll();
        products = products.filter(p => p.id !== productId);
        await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
    }
}

module.exports = ProductsManager;
