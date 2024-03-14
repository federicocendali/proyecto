const ProductManager = require('./ProductManager');

const manager = new ProductManager('productos.json');

// Uso de los métodos
manager.addProduct({
  title: 'Producto 3',
  description: 'Descripción del producto 3',
  price: 30.99,
  thumbnail: 'imagen3.jpg',
  code: 'P003',
  stock: 75,
});

console.log('Todos los productos:', manager.getProducts());
console.log('Producto con id 1:', manager.getProductById(1));

manager.updateProduct(1, { price: 15.99 }); // Actualizar el precio del producto con id 1
manager.deleteProduct(2); // Eliminar el producto con id 2
