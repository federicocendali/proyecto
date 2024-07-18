import { CartManager } from '../dao/cartManager.js';

class CartService {
  constructor(dao) {
    this.dao = dao;
  }
  createCart = async (obj) => {
    return this.dao.createCart(obj);
  };
  getAllCarts = async (obj) => {
    return this.dao.getAllCarts(obj);
  };
  getCartById = async (id) => {
    return this.dao.getCartById(id);
  };
  getOneBy = async (filtro = {}) => {
    return this.dao.getOneBy(filtro);
  };
  update = async (cid, pid) => {
    return this.dao.update(cid, pid);
  };
  getOneByPopulate = async (filtro = {}) => {
    return this.dao.getOneByPopulate(filtro);
  };
  deleteCartById = async (id) => {
    return this.dao.deleteCartById(id);
  };
  deleteCartById = async (cid, pid) => {
    return this.dao.deleteCartById(cid, pid);
  };
  decreaseProductQuantity = async (cid, pid) => {
    return this.dao.decreaseProductQuantity(cid, pid);
  };
}

export const cartService = new CartService(new CartManager());
