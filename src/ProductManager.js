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

  async addProduct(newProduct) {
    try {
      const data = await fs.readFile(this.path, 'utf8');
      let products = JSON.parse(data);
      const newProductId =
        products.length > 0 ? products[products.length - 1].id + 1 : 1;
      newProduct.id = newProductId;
      products.push(newProduct);
      await fs.writeFile(this.path, JSON.stringify(products, null, 2));
      return newProduct;
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(id, updatedProduct) {
    try {
      const data = await fs.readFile(this.path, 'utf8');
      let products = JSON.parse(data);
      const index = products.findIndex((product) => product.id === id);
      if (index !== -1) {
        updatedProduct.id = id;
        products[index] = updatedProduct;
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        return updatedProduct;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const data = await fs.readFile(this.path, 'utf8');
      let products = JSON.parse(data);
      const index = products.findIndex((product) => product.id === id);
      if (index !== -1) {
        products.splice(index, 1);
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProductManager;
