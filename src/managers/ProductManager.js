const fs = require('fs').promises;
const path = require('path');

class ProductManager {
    constructor(filePath) {
        this.filePath = filePath;
        this.products = [];
        this.nextId = 1;
    }

    async init() {
        try {
            await fs.access(this.filePath);
            const data = await fs.readFile(this.filePath, 'utf8');
            this.products = JSON.parse(data);
            if (this.products.length > 0) {
                this.nextId = Math.max(...this.products.map(p => p.id)) + 1;
            }
        } catch (error) {
            // Si el archivo no existe, lo creamos con un array vacío
            await this.saveProducts();
        }
    }

    async saveProducts() {
        try {
            await fs.writeFile(this.filePath, JSON.stringify(this.products, null, 2));
        } catch (error) {
            throw new Error(`Error al guardar productos: ${error.message}`);
        }
    }

    async addProduct(productData) {
        const { title, description, code, price, thumbnail, stock } = productData;

        // Validar campos obligatorios según consigna
        if (!title || !description || !code || !price || !thumbnail || !stock) {
            throw new Error('Todos los campos son obligatorios');
        }

        // Verificar que el código no se repita
        const existingProduct = this.products.find(p => p.code === code);
        if (existingProduct) {
            throw new Error('El código del producto ya existe');
        }

        const newProduct = {
            id: this.nextId++,
            title,
            description,
            code,
            price: Number(price),
            thumbnail, // Singular como pide la consigna
            stock: Number(stock)
        };

        this.products.push(newProduct);
        await this.saveProducts();
        return newProduct;
    }

    async getProducts() {
        return [...this.products];
    }

    async getProductById(id) {
        const product = this.products.find(p => p.id === Number(id));
        if (!product) {
            console.error('Not found'); // Como pide la consigna
            return null;
        }
        return product;
    }

    async updateProduct(id, updateData) {
        const productIndex = this.products.findIndex(p => p.id === Number(id));
        if (productIndex === -1) {
            throw new Error('Producto no encontrado');
        }

        // No permitir actualizar el ID
        if (updateData.id) {
            delete updateData.id;
        }

        // Verificar que el código no se repita (si se está actualizando)
        if (updateData.code) {
            const existingProduct = this.products.find(p => p.code === updateData.code && p.id !== Number(id));
            if (existingProduct) {
                throw new Error('El código del producto ya existe');
            }
        }

        this.products[productIndex] = {
            ...this.products[productIndex],
            ...updateData,
            id: this.products[productIndex].id // Mantener el ID original
        };

        await this.saveProducts();
        return this.products[productIndex];
    }

    async deleteProduct(id) {
        const productIndex = this.products.findIndex(p => p.id === Number(id));
        if (productIndex === -1) {
            throw new Error('Producto no encontrado');
        }

        const deletedProduct = this.products.splice(productIndex, 1)[0];
        await this.saveProducts();
        return deletedProduct;
    }
}

module.exports = ProductManager;
