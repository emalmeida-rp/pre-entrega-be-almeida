const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

async function testAPI() {
    console.log('🧪 Iniciando pruebas de la API...\n');

    try {
        // 1. Crear productos
        console.log('1️⃣ Creando productos...');
        
        const product1 = await axios.post(`${BASE_URL}/api/products`, {
            title: 'Laptop Gaming',
            description: 'Laptop para gaming de alta gama',
            code: 'LAPTOP001',
            price: 1200,
            thumbnail: 'laptop1.jpg',
            stock: 10
        });
        console.log('✅ Producto 1 creado:', product1.data.data.title);

        const product2 = await axios.post(`${BASE_URL}/api/products`, {
            title: 'Mouse Inalámbrico',
            description: 'Mouse inalámbrico ergonómico',
            code: 'MOUSE001',
            price: 50,
            thumbnail: 'mouse1.jpg',
            stock: 100
        });
        console.log('✅ Producto 2 creado:', product2.data.data.title);

        // 2. Listar productos
        console.log('\n2️⃣ Listando todos los productos...');
        const products = await axios.get(`${BASE_URL}/api/products`);
        console.log('📦 Productos encontrados:', products.data.data.length);

        // 3. Crear carrito
        console.log('\n3️⃣ Creando carrito...');
        const cart = await axios.post(`${BASE_URL}/api/carts`);
        const cartId = cart.data.data.id;
        console.log('🛒 Carrito creado con ID:', cartId);

        // 4. Agregar productos al carrito
        console.log('\n4️⃣ Agregando productos al carrito...');
        
        await axios.post(`${BASE_URL}/api/carts/${cartId}/product/1`, {
            quantity: 1
        });
        console.log('✅ Producto 1 agregado al carrito');

        await axios.post(`${BASE_URL}/api/carts/${cartId}/product/2`, {
            quantity: 2
        });
        console.log('✅ Producto 2 agregado al carrito (cantidad: 2)');

        // 5. Verificar carrito
        console.log('\n5️⃣ Verificando carrito...');
        const cartDetails = await axios.get(`${BASE_URL}/api/carts/${cartId}`);
        console.log('🛒 Productos en el carrito:', cartDetails.data.data.products.length);
        console.log('📋 Detalles del carrito:', JSON.stringify(cartDetails.data.data, null, 2));

        // 6. Probar incremento de cantidad
        console.log('\n6️⃣ Probando incremento de cantidad...');
        await axios.post(`${BASE_URL}/api/carts/${cartId}/product/1`, {
            quantity: 1
        });
        console.log('✅ Cantidad del producto 1 incrementada');

        // 7. Verificar carrito actualizado
        console.log('\n7️⃣ Verificando carrito actualizado...');
        const updatedCart = await axios.get(`${BASE_URL}/api/carts/${cartId}`);
        console.log('📋 Carrito actualizado:', JSON.stringify(updatedCart.data.data, null, 2));

        console.log('\n🎉 ¡Todas las pruebas completadas exitosamente!');

    } catch (error) {
        console.error('❌ Error en las pruebas:', error.response?.data || error.message);
    }
}

// Ejecutar pruebas solo si este archivo se ejecuta directamente
if (require.main === module) {
    testAPI();
}

module.exports = testAPI;
