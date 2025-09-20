const fs = require('fs').promises;
const path = require('path');

class CartManager {
    constructor(filePath) {
        this.filePath = filePath;
        this.carts = [];
        this.nextId = 1;
    }

    async init() {
        try {
            await fs.access(this.filePath);
            const data = await fs.readFile(this.filePath, 'utf8');
            this.carts = JSON.parse(data);
            if (this.carts.length > 0) {
                this.nextId = Math.max(...this.carts.map(c => c.id)) + 1;
            }
        } catch (error) {
            // Si el archivo no existe, lo creamos con un array vacío
            await this.saveCarts();
        }
    }

    async saveCarts() {
        try {
            await fs.writeFile(this.filePath, JSON.stringify(this.carts, null, 2));
        } catch (error) {
            throw new Error(`Error al guardar carritos: ${error.message}`);
        }
    }

    async createCart() {
        const newCart = {
            id: this.nextId++,
            products: []
        };

        this.carts.push(newCart);
        await this.saveCarts();
        return newCart;
    }

    async getCartById(id) {
        const cart = this.carts.find(c => c.id === Number(id));
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
        return cart;
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        const cart = await this.getCartById(cartId);
        
        // Buscar si el producto ya existe en el carrito
        const existingProductIndex = cart.products.findIndex(p => p.product === Number(productId));
        
        if (existingProductIndex !== -1) {
            // Si el producto ya existe, incrementar la cantidad
            cart.products[existingProductIndex].quantity += Number(quantity);
        } else {
            // Si el producto no existe, agregarlo
            cart.products.push({
                product: Number(productId),
                quantity: Number(quantity)
            });
        }

        await this.saveCarts();
        return cart;
    }

    async getCarts() {
        return [...this.carts];
    }

    async deleteCart(id) {
        const cartIndex = this.carts.findIndex(c => c.id === Number(id));
        if (cartIndex === -1) {
            throw new Error('Carrito no encontrado');
        }

        const deletedCart = this.carts.splice(cartIndex, 1)[0];
        await this.saveCarts();
        return deletedCart;
    }

    async removeProductFromCart(cartId, productId) {
        const cart = await this.getCartById(cartId);
        const productIndex = cart.products.findIndex(p => p.product === Number(productId));
        
        if (productIndex === -1) {
            throw new Error('Producto no encontrado en el carrito');
        }

        cart.products.splice(productIndex, 1);
        await this.saveCarts();
        return cart;
    }

    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await this.getCartById(cartId);
        const productIndex = cart.products.findIndex(p => p.product === Number(productId));
        
        if (productIndex === -1) {
            throw new Error('Producto no encontrado en el carrito');
        }

        if (quantity <= 0) {
            // Si la cantidad es 0 o menor, eliminar el producto
            cart.products.splice(productIndex, 1);
        } else {
            cart.products[productIndex].quantity = Number(quantity);
        }

        await this.saveCarts();
        return cart;
    }
}

module.exports = CartManager;
