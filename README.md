# API de E-commerce - Primera Entrega

**Servidor Node.js con Express para gestión de productos y carritos de compra**

## 🚀 Instalación y Ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar servidor
npm start
```

**El servidor se ejecuta en:** `http://localhost:8080`

## 📋 Endpoints Implementados

### Productos (`/api/products`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/products` | Listar todos los productos |
| GET | `/api/products/:pid` | Obtener producto por ID |
| POST | `/api/products` | Crear nuevo producto |
| PUT | `/api/products/:pid` | Actualizar producto |
| DELETE | `/api/products/:pid` | Eliminar producto |

### Carritos (`/api/carts`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/carts` | Crear nuevo carrito |
| GET | `/api/carts/:cid` | Obtener carrito por ID |
| POST | `/api/carts/:cid/product/:pid` | Agregar producto al carrito |

## 🧪 Pruebas Rápidas

### 1. Crear un producto
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Laptop Gaming",
    "description": "Laptop para gaming",
    "code": "LAPTOP001",
    "price": 1200,
    "thumbnail": "laptop.jpg",
    "stock": 10
  }'
```

### 2. Crear carrito y agregar producto
```bash
# Crear carrito
curl -X POST http://localhost:8080/api/carts

# Agregar producto (usar ID del carrito devuelto)
curl -X POST http://localhost:8080/api/carts/1/product/1 \
  -H "Content-Type: application/json" \
  -d '{"quantity": 2}'
```

### 3. Verificar datos
```bash
# Listar productos
curl http://localhost:8080/api/products

# Ver carrito
curl http://localhost:8080/api/carts/1
```

## 📁 Estructura del Proyecto

```
├── data/
│   ├── products.json    # Datos de productos
│   └── carts.json       # Datos de carritos
├── src/
│   ├── managers/
│   │   ├── ProductManager.js  # Gestión de productos
│   │   └── CartManager.js     # Gestión de carritos
│   └── routes/
│       ├── products.js        # Rutas de productos
│       └── carts.js          # Rutas de carritos
├── server.js                  # Servidor principal
└── test-api.js               # Script de pruebas
```

## ✅ Cumplimiento de Consignas

### ProductManager
- ✅ Constructor con `products` como arreglo vacío
- ✅ Propiedades: `title`, `description`, `price`, `thumbnail`, `code`, `stock`
- ✅ `addProduct()`: Valida campos obligatorios y código único
- ✅ `getProducts()`: Devuelve arreglo de productos
- ✅ `getProductById()`: Muestra "Not found" en consola si no encuentra

### API de Productos
- ✅ GET `/api/products` - Listar productos
- ✅ GET `/api/products/:pid` - Obtener por ID
- ✅ POST `/api/products` - Crear producto
- ✅ PUT `/api/products/:pid` - Actualizar producto
- ✅ DELETE `/api/products/:pid` - Eliminar producto

### API de Carritos
- ✅ POST `/api/carts` - Crear carrito
- ✅ GET `/api/carts/:cid` - Obtener carrito
- ✅ POST `/api/carts/:cid/product/:pid` - Agregar producto

### Persistencia
- ✅ Archivos JSON para productos y carritos
- ✅ IDs únicos auto-generados
- ✅ Validación de códigos únicos

## 🔧 Características Técnicas

- **Servidor:** Node.js + Express (puerto 8080)
- **Persistencia:** Archivos JSON
- **Validación:** Campos obligatorios y códigos únicos
- **Manejo de errores:** Respuestas HTTP apropiadas
- **Código:** Optimizado con callbacks y funciones helper

## 📝 Notas Importantes

- Todos los campos de producto son obligatorios
- Los códigos de producto deben ser únicos
- La cantidad en carritos se incrementa automáticamente
- Los datos se persisten automáticamente en archivos JSON