const fs = require('fs').promises;

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
  }

  async getProducts(limit) {
    try {
      const data = await fs.readFile(this.path, 'utf8');
      const products = JSON.parse(data);
      return limit ? products.slice(0, limit) : products;
    } catch (error) {
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const data = await fs.readFile(this.path, 'utf8');
      const products = JSON.parse(data);
      return products.find((product) => product.id === id);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProductManager;
