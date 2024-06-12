const fs = require('fs').promises;
const path = require('path');

class CartsManager {
    constructor(filePath, productsManager) {
        this.filePath = filePath;
        this.productsManager = productsManager;
    }

    async readFile() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (err) {
            throw new Error('Error reading carts file');
        }
    }

    async writeFile(data) {
        try {
            await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
        } catch (err) {
            throw new Error('Error writing carts file');
        }
    }

    async getAllCarts() {
        return await this.readFile();
    }

    async getCartById(id) {
        const carts = await this.readFile();
        return carts.find(c => c.id === id);
    }

    async addCart(cart) {
        const carts = await this.readFile();
        carts.push(cart);
        await this.writeFile(carts);
        return cart;
    }

    async addProductToCart(cartId, productId) {
        const carts = await this.readFile();
        const cartIndex = carts.findIndex(c => c.id === cartId);

        if (cartIndex === -1) {
            throw new Error('Cart not found');
        }

        const product = await this.productsManager.getProductById(productId);

        if (!product) {
            throw new Error('Product not found');
        }

        const cart = carts[cartIndex];
        const productIndex = cart.products.findIndex(p => p.product === productId);

        if (productIndex !== -1) {
            cart.products[productIndex].quantity++;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await this.writeFile(carts);
        return cart;
    }
}

module.exports = CartsManager;
