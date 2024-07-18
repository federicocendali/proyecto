import { logger } from '../helper/Logger.js';
import { productsModel } from './models/products.model.js';

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
  deleteProductById = async (_id) => {
    try {
      return await productsModel.deleteOne({ _id });
    } catch (err) {
      return err;
    }
  };
  async getProductsByFiltro(filtro) {
    return await productsModel.findOne(filtro);
  }
  async getAll() {
    return await productsModel.find().lean();
  }
  async getAllPaginate(page = 1) {
    return await productsModel.paginate({}, { limit: 5, page, lean: true });
  }
  async getProductsPaginate(filtro, opciones) {
    try {
      logger.debug(
        `Opciones de paginación recibidas: ${JSON.stringify(opciones)}`
      );
      let resultado = await productsModel.paginate(filtro, opciones);
      logger.debug(`Resultado de la paginación: ${JSON.stringify(resultado)}`);
      let sortOrder = opciones.sort;
      if (sortOrder === 'asc') {
        resultado = resultado.docs.sort((a, b) => a.price - b.price);
      } else if (sortOrder === 'desc') {
        resultado = resultado.docs.sort((a, b) => b.price - a.price);
      } else {
        resultado = {
          status: 'success',
          payload: resultado.docs,
          totalPages: resultado.totalPages,
          prevPage: resultado.prevPage,
          nextPage: resultado.nextPage,
          page: resultado.page,
          hasPrevPage: resultado.hasPrevPage,
          hasNextPage: resultado.hasNextPage,
          prevLink: 'En construcción',
          nextLink: 'En construcción',
        };
      }
      return resultado;
    } catch (error) {
      logger.error(`Error en getProductsPaginate: ${error.message}`);
      throw error;
    }
  }
}
export { ProductManager };
