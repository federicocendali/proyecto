class ProductManager {
  constructor() {
    this.products = [];
    this.productId = 0;
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    // Validar que todos los campos sean obligatorios
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log('Todos los campos son obligatorios.');
      return;
    }

    // Validar que el código del producto no esté repetido
    const existingProduct = this.products.find(
      (product) => product.code === code
    );
    if (existingProduct) {
      console.log('Ya existe un producto con ese código.');
      return;
    }

    // Agregar el producto al arreglo de productos con un id autoincrementable
    const product = {
      id: (this.productId += 1),
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };
    this.products.push(product);
    console.log('Producto agregado correctamente:', product);
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find((product) => product.id === id);
    if (!product) {
      console.log('Producto no encontrado.');
      return;
    }
    return product;
  }
}

// Ejemplo de uso:
const manager = new ProductManager();
manager.addProduct(
  'Producto 1',
  'Descripción del producto 1',
  10.99,
  'imagen1.jpg',
  'P001',
  100
);
manager.addProduct(
  'Producto 2',
  'Descripción del producto 2',
  20.99,
  'imagen2.jpg',
  'P002',
  50
);

console.log('Todos los productos:', manager.getProducts());
console.log('Producto con id 1:', manager.getProductById(1));
