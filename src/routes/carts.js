const express = require('express');
const CartManager = require('../managers/CartManager');
const path = require('path');

const router = express.Router();
const cartManager = new CartManager(path.join(__dirname, '../../data/carts.json'));

// Inicializar el CartManager
cartManager.init().catch(console.error);

// Función helper para manejar respuestas
function handleResponse(res, promise, successMessage = null) {
    promise
        .then(data => {
            const response = { success: true, data };
            if (successMessage) response.message = successMessage;
            res.json(response);
        })
        .catch(error => {
            const statusCode = error.message === 'Carrito no encontrado' || error.message === 'Producto no encontrado en el carrito' ? 404 : 
                             error.message.includes('requerida') ? 400 : 500;
            res.status(statusCode).json({
                success: false,
                error: error.message
            });
        });
}

// POST /api/carts/ - Crear nuevo carrito
router.post('/', (req, res) => {
    handleResponse(res, cartManager.createCart(), 'Carrito creado exitosamente');
});

// GET /api/carts/:cid - Obtener carrito por ID
router.get('/:cid', (req, res) => {
    const { cid } = req.params;
    handleResponse(res, cartManager.getCartById(cid));
});

// POST /api/carts/:cid/product/:pid - Agregar producto al carrito
router.post('/:cid/product/:pid', (req, res) => {
    const { cid, pid } = req.params;
    const { quantity = 1 } = req.body;
    handleResponse(res, cartManager.addProductToCart(cid, pid, quantity), 'Producto agregado al carrito exitosamente');
});

// GET /api/carts/ - Listar todos los carritos
router.get('/', (req, res) => {
    handleResponse(res, cartManager.getCarts());
});

// DELETE /api/carts/:cid - Eliminar carrito
router.delete('/:cid', (req, res) => {
    const { cid } = req.params;
    handleResponse(res, cartManager.deleteCart(cid), 'Carrito eliminado exitosamente');
});

// PUT /api/carts/:cid/product/:pid - Actualizar cantidad de producto en carrito
router.put('/:cid/product/:pid', (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    
    if (quantity === undefined) {
        return res.status(400).json({
            success: false,
            error: 'La cantidad es requerida'
        });
    }
    
    handleResponse(res, cartManager.updateProductQuantity(cid, pid, quantity), 'Cantidad actualizada exitosamente');
});

// DELETE /api/carts/:cid/product/:pid - Eliminar producto del carrito
router.delete('/:cid/product/:pid', (req, res) => {
    const { cid, pid } = req.params;
    handleResponse(res, cartManager.removeProductFromCart(cid, pid), 'Producto eliminado del carrito exitosamente');
});

module.exports = router;
