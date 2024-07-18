import { isValidObjectId } from 'mongoose';
import { cartService } from '../services/CartService.js';
import { productService } from '../services/ProductService.js';
import { ticketService } from '../services/TicketService.js';
import { sendTicketDeCompraEmail } from '../helper/nodeMailer.js';
import { logger } from '../helper/Logger.js';

export class CartController {
  static getAll = async (req, res) => {
    try {
      const response = await cartManager.getAllCarts();
      res.json(response);
    } catch (error) {
      logger.error(
        `Error al intentar obtener todos los carritos: ${error.message}`
      );
      res
        .status(500)
        .json({ error: `Error al intentar obtener todos los carritos` });
    }
  };

  static getById = async (req, res) => {
    const { cid } = req.params;
    try {
      if (!isValidObjectId(cid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Enter valid cid/pid` });
      }
      const carrito = await cartService.getOneByPopulate({ _id: cid });
      if (!carrito) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Non-existent cart: id ${cid}` });
      }
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json({ carrito });
    } catch (error) {
      logger.error(
        `Error al intentar obtener el carrito con ID ${cid}: ${error.message}`
      );
      res.status(500).json({ error: `Error al intentar obtener el carrito` });
    }
  };

  static createNewCart = async (req, res) => {
    try {
      const response = await cartService.createCart();
      logger.info(`Nuevo carrito creado: ${response._id}`);
      res.json(response);
    } catch (error) {
      logger.error(
        `Error al intentar crear un nuevo carrito: ${error.message}`
      );
      res.status(500).send('Error when trying to create cart');
    }
  };

  static addProductToCart = async (req, res) => {
    let { cid, pid } = req.params;
    if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
      logger.error(`Ingrese cid / pid válidos: cid=${cid}, pid=${pid}`);
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({ error: `Ingrese cid / pid válidos` });
    }
    try {
      let carrito = await cartService.getOneBy({ _id: cid });
      if (!carrito) {
        logger.error(`Carrito inexistente: id ${cid}`);
        res.setHeader('Content-Type', 'application/json');
        return res
          .status(400)
          .json({ error: `Carrito inexistente: id ${cid}` });
      }
      let product = await productService.getOneBy({ _id: pid });
      if (!product) {
        logger.error(`No existe producto con id ${pid}`);
        res.setHeader('Content-Type', 'application/json');
        return res
          .status(400)
          .json({ error: `No existe producto con id ${pid}` });
      }
      let indiceProducto = carrito.products.findIndex((p) => p.product == pid);
      if (indiceProducto === -1) {
        carrito.products.push({ product: pid, quantity: 1 });
      } else {
        carrito.products[indiceProducto].quantity++;
      }
      logger.info(`Producto añadido al carrito: ${pid}`);
      let resultado = await cartService.update(cid, carrito);
      if (resultado.modifiedCount > 0) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({
          payload: 'Carrito actualizado, se agregó producto exitosamente',
        });
      } else {
        logger.error(`Error al actualizar el carrito con id ${cid}`);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({
          error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
          detalle: `No se pudo realizar la actualización`,
        });
      }
    } catch (error) {
      logger.error(
        `Error en el servidor al procesar la solicitud: ${error.message}`
      );
      res.setHeader('Content-Type', 'application/json');
      return res
        .status(500)
        .json({ error: `Error inesperado en el servidor: ${error.message}` });
    }
  };

  static deleteProductByCart = async (req, res) => {
    const { cid, pid } = req.params;
    if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
      logger.error(`Ingrese cid / pid válidos: cid=${cid}, pid=${pid}`);
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({ error: `Ingrese cid / pid válidos` });
    }
    try {
      await cartService.deleteProductByCartQuantity(cid, pid);
      logger.info(
        `Cantidad del producto con ID ${pid} reducida en el carrito con ID ${cid}`
      );
      res.json({
        payload: `Se redujo la cantidad del producto con ID: ${pid} en el carrito con ID: ${cid}`,
      });
    } catch (error) {
      logger.error(
        `Error al reducir cantidad del producto en carrito: ${error.message}`
      );
      return res.status(500).json({ error: `${error.message}` });
    }
  };

  static deleteCartById = async (req, res) => {
    let { cid } = req.params;
    if (!isValidObjectId(cid)) {
      logger.error(`Ingrese un ID de MongoDB válido: cid=${cid}`);
      return res.status(400).json({
        error: `Ingrese un ID de MongoDB válido`,
      });
    }
    if (!cid) {
      logger.warn(`Campos no llenados correctamente: cid=${cid}`);
      return res
        .status(300)
        .json({ error: 'Campos no llenados correctamente' });
    }
    try {
      await cartService.deleteCartById(cid);
      logger.info(`Carrito con ID ${cid} eliminado correctamente`);
      res.setHeader('Content-Type', 'application/json');
      return res.json({
        payload: `Carrito con ID :${cid} fue eliminado con éxito`,
      });
    } catch (error) {
      logger.error(`Error al eliminar carrito: ${error.message}`);
      return res.status(500).json({ error: `${error.message}` });
    }
  };

  static updateProduct = async (req, res) => {
    const { cId, pId } = req.params;
    if (!isValidObjectId(cId) || !isValidObjectId(pId)) {
      logger.error(`Ingrese cid / pid válidos: cId=${cId}, pId=${pId}`);
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({ error: `Ingrese cid / pid válidos` });
    }
    try {
      let carrito = await cartService.getOneBy({ _id: cId });
      if (!carrito) {
        logger.error(`Carrito inexistente: id ${cId}`);
        res.setHeader('Content-Type', 'application/json');
        return res
          .status(400)
          .json({ error: `Carrito inexistente: id ${cId}` });
      }
      let productIndex = carrito.products.findIndex((p) => p.product == pId);
      if (productIndex === -1) {
        logger.error(`El producto con id ${pId} no está en el carrito`);
        res.setHeader('Content-Type', 'application/json');
        return res
          .status(400)
          .json({ error: `El producto con id ${pId} no está en el carrito` });
      }
      const { quantity } = req.body;
      if (quantity <= 0) {
        logger.error(
          `La cantidad debe ser mayor que cero: cantidad=${quantity}`
        );
        res.setHeader('Content-Type', 'application/json');
        return res
          .status(400)
          .json({ error: `La cantidad debe ser mayor que cero` });
      }
      carrito.products[productIndex].quantity = quantity;
      const resultado = await cartService.update(cId, carrito);
      if (resultado.modifiedCount > 0) {
        logger.info(
          `Producto en el carrito actualizado: cId=${cId}, pId=${pId}`
        );
        res.setHeader('Content-Type', 'application/json');
        return res
          .status(200)
          .json({ payload: 'Producto en el carrito actualizado' });
      } else {
        logger.error(
          `Error inesperado en el servidor al actualizar el carrito: cId=${cId}`
        );
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({
          error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
          detalle: `No se pudo realizar la actualizacion`,
        });
      }
    } catch (error) {
      logger.error(`Error al procesar la solicitud: ${error.message}`);
      return res.status(500).json({ error: `${error.message}` });
    }
  };

  static purchase = async (req, res) => {
    let cid = req.params.cid;
    let usuario = req.user;
    let productosConStock = [];
    let productosSinStock = [];
    try {
      const cart = await cartService.getCartById(cid);
      if (!cart) {
        return res.status(404).json({ message: 'Carrito no encontrado' });
      }
      for (let i = 0; i < cart.products.length; i++) {
        let product = await productService.getProductsByFiltro(
          cart.products[i].product._id
        );
        if (!product) {
          return res.status(404).json({
            message: `Id de producto : ${cart.products[i].product._id} no encontrado`,
          });
        }
        if (cart.products[i].quantity <= product.stock) {
          let nuevoStock = { stock: product.stock - cart.products[i].quantity };
          await productService.updateProduct(
            cart.products[i].product._id,
            nuevoStock
          );
          productosConStock.push(cart.products[i]);
          logger.info('Producto añadido:', cart.products[i]);
        } else {
          productosSinStock.push(cart.products[i]);
          logger.warn('Producto no facturable añadido:', cart.products[i]);
        }
      }
      logger.info('Productos para facturar:', productosConStock);
      logger.info('Productos sin stock restantes:', productosSinStock);
      const precioTotal = productosConStock.map((item) => ({
        price: item.product.price * item.quantity,
        quantity: item.quantity,
        product: item.product._id,
      }));
      const total = precioTotal.reduce(
        (acumulador, valorActual) => acumulador + valorActual.price,
        0
      );
      const cantidadesPorUnidad = precioTotal.reduce(
        (acumulador, valorActual) => {
          acumulador[valorActual.product] = valorActual.quantity;
          return acumulador;
        },
        {}
      );
      logger.info('Total a pagar:', total);
      logger.info('Cantidades por unidad:', cantidadesPorUnidad);
      await cartService.update(cart._id, { products: productosSinStock });
      const compraFinal = {
        purchaser: usuario.email,
        code: Math.floor(Math.random() * 100000),
        amount: total,
        products: productosConStock.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        purchase_datetime: Date.now(),
      };
      await sendTicketDeCompraEmail(
        usuario.email,
        compraFinal.code,
        compraFinal.amount
      );
      logger.info('Datos de compra:', compraFinal);
      let ticket = await ticketService.create(compraFinal);
      logger.info('Ticket creado:', ticket);
      res.setHeader('Content-Type', 'application/json');
      return res.status(201).json(ticket);
    } catch (error) {
      logger.error('Error procesando compra:', error);
      res.setHeader('Content-Type', 'application/json');
      return res
        .status(500)
        .json('Error inesperado en el servidor al procesar la compra');
    }
  };
}
