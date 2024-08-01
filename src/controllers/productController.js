import { productService } from '../services/ProductService.js';
import { isValidObjectId, CustomError } from '../utils.js';
import { TIPOS_ERROR } from '../utils/EnumeraErrores.js';
import {
  argumentosRepetidosProduct,
  productoExistente,
  tituloObligatorioProduct,
} from '../utils/erroresProducts.js';
import { logger } from '../helper/Logger.js';
import { faker } from '@faker-js/faker';

export class ProductController {
  static getProduct = async (req, res) => {
    try {
      const products = await productService.getProducts();
      res.json({ products });
    } catch (error) {
      logger.error(`Error al intentar obtener productos: ${error.message}`);
      res.status(500).json({ error: `Error al intentar obtener productos` });
    }
  };

  static getProductById = async (req, res) => {
    const { pid } = req.params;
    try {
      if (!isValidObjectId(pid)) {
        logger.warn('ID de producto inválido', { pid });
        return res.status(400).json({ error: 'ID de producto inválido' });
      }
      const productfind = await productService.getProductById(pid);
      res.json({ status: 'success', productfind });
    } catch (error) {
      logger.error(
        `Error al intentar obtener producto por ID: ${pid}: ${error.message}`
      );
      res
        .status(500)
        .json({ error: `Error al intentar obtener producto por ID: ${pid}` });
    }
  };

  static updateProduct = async (req, res) => {
    const { pid } = req.params;
    try {
      if (!isValidObjectId(pid)) {
        logger.warn('ID de producto inválido', { pid });
        return res.status(400).json({ error: 'ID de producto inválido' });
      }
      const updatedproduct = await productService.updateProduct(pid, req.body);
      res.json({ status: 'success', updatedproduct });
    } catch (error) {
      logger.error(
        `Error al intentar actualizar producto con ID: ${pid}: ${error.message}`
      );
      res.status(500).json({
        error: `Error al intentar actualizar producto con ID: ${pid}`,
      });
    }
  };

  static deleteById = async (req, res) => {
    const { pid } = req.params;
    try {
      if (!isValidObjectId(pid)) {
        logger.warn('ID de producto inválido', { pid });
        return res.status(400).json({ error: 'ID de producto inválido' });
      }
      const deleteproduct = await productService.deleteProductById(pid);
      res.json({ status: 'success', deleteproduct });
    } catch (error) {
      logger.error(
        `Error al intentar eliminar producto con ID: ${pid}: ${error.message}`
      );
      res
        .status(500)
        .json({ error: `Error al intentar eliminar producto con ID: ${pid}` });
    }
  };

  static addProduct = async (req, res) => {
    let { title, ...otrasPropiedades } = req.body;
    if (!title) {
      logger.warn('Falta el título del producto', { body: req.body });
      CustomError.createError(
        'Argumento nombre faltante',
        tituloObligatorioProduct(req.body),
        TIPOS_ERROR.ARGUMENTOS_INVALIDOS
      );
    }
    let existe;
    try {
      existe = await productService.getOneBy({ title });
    } catch (error) {
      logger.error(
        `Error al intentar buscar producto por título: ${title}: ${error.message}`
      );
      res.setHeader('Content-Type', 'application/json');
      return res.status(500).json({
        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
        detalle: `${error.message}`,
      });
    }
    if (existe) {
      CustomError.createError(
        'Error',
        productoExistente(req.body),
        'Ya hay un producto igual',
        TIPOS_ERROR.CONFLICT
      );
      logger.warn('Ya existe un producto con el mismo título', { title });
    }
    try {
      let newProduct = await productService.create({
        title,
        ...otrasPropiedades,
      });
      res.setHeader('Content-Type', 'application/json');
      return res.status(201).json({ newProduct });
    } catch (error) {
      logger.error(`Error al intentar crear nuevo producto: ${error.message}`);
      CustomError.createError(
        'Se repite info',
        argumentosRepetidosProduct(req.body),
        TIPOS_ERROR.ARGUMENTOS_INVALIDOS
      );
    }
  };

  static mockProducts = async (req, res) => {
    logger.info('Iniciando generación de productos simulados');
    const mockProducts = [];
    for (let i = 0; i < 100; i++) {
      mockProducts.push({
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        stock: faker.string.numeric(3),
        thumbnail: faker.image.imageUrl(),
        code: faker.random.alphaNumeric(10),
        category: faker.commerce.department(),
        status: faker.datatype.boolean(),
      });
    }
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ status: 'success', products: mockProducts });
  };
}
