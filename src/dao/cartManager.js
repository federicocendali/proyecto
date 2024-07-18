import { cartsModel } from './models/carts.model.js';

class CartManager {
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
    return await cartsModel.findOne({ _id: id }).populate('products.product');
  }
  async getOneBy(filtro = {}) {
    return await cartsModel.findOne(filtro).lean();
  }
  async update(id, carrito) {
    return await cartsModel.updateOne({ _id: id }, carrito);
  }
  async getOneByPopulate(filtro = {}) {
    return await cartsModel.findOne(filtro).populate('products.product').lean();
  }
  async deleteCartById(id) {
    return await cartsModel.findByIdAndDelete({ [this.ID_FIELD]: id });
  }
  async decreaseProductQuantity(cid, pid) {
    return await cartsModel.updateOne(
      { _id: cid },
      { $pull: { products: { product: pid } } }
    );
  }
}

export { CartManager };
