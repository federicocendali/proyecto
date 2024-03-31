const fs = require('fs').promises;

class CartManager {
  constructor(filePath) {
    this.path = filePath;
  }

  async createCart() {
    try {
      const newCartId = await this.generateNewCartId();
      const newCart = { id: newCartId, products: [] };
      await this.saveCart(newCart);
      return newCart;
    } catch (error) {
      throw error;
    }
  }

  async getCart(cartId) {
    try {
      const carts = await this.getCarts();
      return carts.find((cart) => cart.id === cartId);
    } catch (error) {
      throw error;
    }
  }

  async addProductToCart(cartId, productId, quantity) {
    try {
      const carts = await this.getCarts();
      const cartIndex = carts.findIndex((cart) => cart.id === cartId);
      if (cartIndex !== -1) {
        const cart = carts[cartIndex];
        const productIndex = cart.products.findIndex(
          (product) => product.id === productId
        );
        if (productIndex !== -1) {
          cart.products[productIndex].quantity += quantity;
        } else {
          cart.products.push({ id: productId, quantity });
        }
        await this.saveCarts(carts);
        return cart;
      } else {
        throw new Error('Cart not found');
      }
    } catch (error) {
      throw error;
    }
  }

  async generateNewCartId() {
    const carts = await this.getCarts();
    const lastCart = carts[carts.length - 1];
    return lastCart ? lastCart.id + 1 : 1;
  }

  async getCarts() {
    try {
      const data = await fs.readFile(this.path, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async saveCart(cart) {
    try {
      const carts = await this.getCarts();
      carts.push(cart);
      await this.saveCarts(carts);
    } catch (error) {
      throw error;
    }
  }

  async saveCarts(carts) {
    try {
      await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CartManager;
