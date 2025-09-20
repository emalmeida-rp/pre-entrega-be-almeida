const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = 8080;

// Middleware para parsear JSON
app.use(express.json());

// Middleware para logging de requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Importar rutas
const productsRouter = require('./src/routes/products');
const cartsRouter = require('./src/routes/carts');

// Usar las rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Ruta raíz
app.get('/', (req, res) => {
    res.json({
        message: 'API de E-commerce - Gestión de Productos y Carritos',
        version: '1.0.0',
        endpoints: {
            products: {
                'GET /api/products': 'Listar todos los productos',
                'GET /api/products/:pid': 'Obtener producto por ID',
                'POST /api/products': 'Crear nuevo producto',
                'PUT /api/products/:pid': 'Actualizar producto',
                'DELETE /api/products/:pid': 'Eliminar producto'
            },
            carts: {
                'GET /api/carts': 'Listar todos los carritos',
                'GET /api/carts/:cid': 'Obtener carrito por ID',
                'POST /api/carts': 'Crear nuevo carrito',
                'POST /api/carts/:cid/product/:pid': 'Agregar producto al carrito',
                'PUT /api/carts/:cid/product/:pid': 'Actualizar cantidad de producto',
                'DELETE /api/carts/:cid': 'Eliminar carrito',
                'DELETE /api/carts/:cid/product/:pid': 'Eliminar producto del carrito'
            }
        }
    });
});

// Middleware para manejar rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Ruta no encontrada'
    });
});

// Middleware para manejo de errores
app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
    });
});

// Función para crear directorio de datos si no existe
async function ensureDataDirectory() {
    const dataDir = path.join(__dirname, 'data');
    try {
        await fs.access(dataDir);
    } catch (error) {
        await fs.mkdir(dataDir, { recursive: true });
        console.log('Directorio de datos creado');
    }
}

// Inicializar servidor
async function startServer() {
    try {
        await ensureDataDirectory();
        
        app.listen(PORT, () => {
            console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
            console.log(`📚 Documentación disponible en http://localhost:${PORT}`);
            console.log(`🛍️  API de productos: http://localhost:${PORT}/api/products`);
            console.log(`🛒 API de carritos: http://localhost:${PORT}/api/carts`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
}

startServer();
