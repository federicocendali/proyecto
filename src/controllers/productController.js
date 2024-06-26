import { productsModel } from '../dao/models/products.model.js';

export default class ProductManager {
  getProducts = async () => {
    try {
      return await productsModel.find().lean();
    } catch (err) {
      return err;
    }
  };
  getProductsView = async () => {
    try {
      return await productsModel.find().lean();
    } catch (err) {
      return err;
    }
  };
  getProductById = async (id) => {
    try {
      return await productsModel.findById(id);
    } catch (err) {
      return { error: err.message };
    }
  };
  async getOneBy(filtro = {}) {
    return await productsModel.findOne(filtro).lean();
  }
  async create(product) {
    return await productsModel.create(product);
  }
  addProduct = async (product) => {
    try {
      await productsModel.create(product);
      return await productsModel.findOne({ title: product.title });
    } catch (err) {
      return err;
    }
  };
  updateProduct = async (id, product) => {
    try {
      return await productsModel.findByIdAndUpdate(id, { $set: product });
    } catch (err) {
      return err;
    }
  };
  deleteProductById = async (id) => {
    try {
      return await productsModel.deleteOne({ id });
    } catch (err) {
      return err;
    }
  };
  async getAll() {
    return await productsModel.find().lean();
  }
  async getAllPaginate(page = 1) {
    return await productsModel.paginate({}, { limit: 5, page, lean: true });
  }
  async getProductsPaginate(filtro, opciones) {
    console.log(opciones);
    let resultado = await productsModel.paginate(filtro, opciones);
    console.log(resultado);
    let sortOrder = opciones.sort;
    if (sortOrder == 'asc') {
      return (resultado = resultado.docs.sort(function (a, b) {
        return a.price - b.price;
      }));
    } else if (sortOrder == 'desc') {
      return (resultado = resultado.docs.sort(function (a, b) {
        return b.price - a.price;
      }));
    } else {
      return (resultado = {
        status: 'success',
        payload: resultado.docs,
        totalPages: resultado.totalPages,
        prevPage: resultado.prevPage,
        nextPage: resultado.nextPage,
        page: resultado.page,
        hasPrevPage: resultado.hasPrevPage,
        hasNextPage: resultado.hasNextPage,
        prevLink: 'En construccion',
        nextLink: 'En construccion',
      });
    }
  }
}
