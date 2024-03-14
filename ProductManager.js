const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = [];
    this.loadProducts();
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      this.products = JSON.parse(data);
    } catch (err) {
      // Si el archivo no existe o hay un error al leerlo, se inicializa con un array vacío
      this.products = [];
    }
  }

  saveProducts() {
    fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
  }

  addProduct(productData) {
    const { title, description, price, thumbnail, code, stock } = productData;
    const newProduct = {
      id:
        this.products.length > 0
          ? this.products[this.products.length - 1].id + 1
          : 1,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };
    this.products.push(newProduct);
    this.saveProducts();
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    return this.products.find((product) => product.id === id);
  }

  updateProduct(id, newData) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...newData };
      this.saveProducts();
      return true; // Indica que se actualizó correctamente
    }
    return false; // Indica que no se encontró el producto con el ID especificado
  }

  deleteProduct(id) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      this.saveProducts();
      return true; // Indica que se eliminó correctamente
    }
    return false; // Indica que no se encontró el producto con el ID especificado
  }
}

module.exports = ProductManager;
