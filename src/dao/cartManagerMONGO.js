import { cartsModel } from '../dao/models/carts.model.js';

export default class CartManager {
  ID_FIELD = '_id';
  async createCart() {
    try {
      let carrito = await cartsModel.create({ products: [] });
      return carrito.toJSON();
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async getAllCarts() {
    const carts = await cartsModel.find().lean();
    return carts;
  }
  async getCartById(id) {
    return await cartsModel
      .findOne({ _id: id })
      .populate('products.product')
      .lean();
  }
  async getOneBy(filtro = {}) {
    return await cartsModel.findOne(filtro).lean();
  }
  async deleteCartById(id) {
    try {
      return await cartsModel.findByIdAndDelete({ [this.ID_FIELD]: id });
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async update(id, carrito) {
    return await cartsModel.updateOne({ _id: id }, carrito);
  }
  async getOneByPopulate(filtro = {}) {
    return await cartsModel.findOne(filtro).populate('products.product').lean();
  }
  async deleteProductFromCart(id, productId) {
    try {
      const cart = await cartsModel.findById(id);
      cart.products.remove(productId);
      cart.save();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async decreaseProductQuantity(cid, pid) {
    try {
      const cart = await cartsModel.findById(cid);
      const productIndex = cart.products.findIndex(
        (product) => product.product == pid
      );
      if (productIndex !== -1) {
        if (cart.products[productIndex].quantity > 1) {
          cart.products[productIndex].quantity -= 1;
          await cart.save();
        } else {
          cart.products.splice(productIndex, 1);
          await cart.save();
        }
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
