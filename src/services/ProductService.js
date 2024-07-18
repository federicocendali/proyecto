import { ProductManager } from '../dao/productManager.js';

class ProductService {
  constructor(dao) {
    this.dao = dao;
  }
  getProducts = async (obj) => {
    return this.dao.getProducts(obj);
  };
  getProductsView = async (obj) => {
    return this.dao.getProductsView(obj);
  };
  getProductById = async (id) => {
    return this.dao.getProductById(id);
  };
  getProductsByFiltro = async (filtro) => {
    return this.dao.getProductsByFiltro(filtro);
  };
  getOneBy = async (filtro = {}) => {
    return this.dao.getOneBy(filtro);
  };
  create = async (product) => {
    return this.dao.create(product);
  };
  addProduct = async (product) => {
    return this.dao.addProduct(product);
  };
  updateProduct = async (cid, pid) => {
    return this.dao.updateProduct(cid, pid);
  };
  deleteProductById = async (_id) => {
    return this.dao.deleteProductById(_id);
  };
  getAll = async (id) => {
    return this.dao.getAll(id);
  };
  getAllPaginate = async (page = 1) => {
    return this.dao.getAllPaginate((page = 1));
  };
  getProductsPaginate = async (filtro, opciones) => {
    return this.dao.getProductsPaginate(filtro, opciones);
  };
}

export const productService = new ProductService(new ProductManager());
