const express = require('express');
const ProductManager = require('../managers/ProductManager');
const path = require('path');

const router = express.Router();
const productManager = new ProductManager(path.join(__dirname, '../../data/products.json'));

// Inicializar el ProductManager
productManager.init().catch(console.error);

// Función helper para manejar respuestas
function handleResponse(res, promise, successMessage = null) {
    promise
        .then(data => {
            const response = { success: true, data };
            if (successMessage) response.message = successMessage;
            res.json(response);
        })
        .catch(error => {
            const statusCode = error.message === 'Producto no encontrado' ? 404 : 
                             error.message.includes('obligatorios') || error.message.includes('ya existe') ? 400 : 500;
            res.status(statusCode).json({
                success: false,
                error: error.message
            });
        });
}

// GET /api/products/ - Listar todos los productos
router.get('/', (req, res) => {
    handleResponse(res, productManager.getProducts());
});

// GET /api/products/:pid - Obtener producto por ID
router.get('/:pid', (req, res) => {
    const { pid } = req.params;
    handleResponse(res, productManager.getProductById(pid));
});

// POST /api/products/ - Crear nuevo producto
router.post('/', (req, res) => {
    const productData = req.body;
    handleResponse(res, productManager.addProduct(productData), 'Producto creado exitosamente');
});

// PUT /api/products/:pid - Actualizar producto
router.put('/:pid', (req, res) => {
    const { pid } = req.params;
    const updateData = req.body;
    handleResponse(res, productManager.updateProduct(pid, updateData), 'Producto actualizado exitosamente');
});

// DELETE /api/products/:pid - Eliminar producto
router.delete('/:pid', (req, res) => {
    const { pid } = req.params;
    handleResponse(res, productManager.deleteProduct(pid), 'Producto eliminado exitosamente');
});

module.exports = router;
