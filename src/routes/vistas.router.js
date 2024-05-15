import { Router } from 'express';
import ProductManagerMONGO from '../dao/productManagerMONGO.js';
import CartManager from '../dao/cartManagerMONGO.js';

export const router = Router();

const productManager = new ProductManagerMONGO();
const cartManager = new CartManager();

router.get('/realTimeproducts', async (req, res) => {
  res.status(200).render('realTimeProducts');
});

router.get('/chat', async (req, res) => {
  res.status(200).render('chat');
});

router.get('/', async (req, res) => {
  try {
    let { pagina, query, sort } = req.query;
    if (!pagina) pagina = 1;

    const {
      docs: listOfProducts,
      totalPages,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
    } = await productManager.getAllPaginate(pagina);

    let filteredProducts = listOfProducts;

    if (query) {
      filteredProducts = filteredProducts.filter((product) =>
        product.title.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (sort === 'asc') {
      filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === 'desc') {
      filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
    }

    res.setHeader('Content-Type', 'text/html');
    res.status(200).render('inicio', {
      listOfProducts: filteredProducts,
      totalPages,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error interno del servidor');
  }
});

router.get('/paginacion', async (req, res) => {
  try {
    let { page, query, sort } = req.query;

    const {
      docs: listOfProducts,
      totalPages,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
    } = await productManager.getAllPaginate(page);

    let filteredProducts = listOfProducts;
    if (query) {
      filteredProducts = filteredProducts.filter((product) =>
        product.title.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (sort === 'asc') {
      filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === 'desc') {
      filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
    }

    if (req.accepts('json')) {
      return res.status(200).json({
        status: 'success',
        payload: filteredProducts,
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink: 'En construccion',
        nextLink: 'En construccion',
      });
    }

    res.status(200).render('inicio', {
      listOfProducts: filteredProducts,
      totalPages,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error interno del servidor');
  }
});

router.get('/carts/:cid', async (req, res) => {
  let id = req.params.cid;
  let products;
  try {
    let carrito = await cartManager.getCartById(id);
    console.log(carrito);
    products = carrito.products;
    res.setHeader('Content-Type', 'text/html');
    res.status(200).render('carrito', { products });
  } catch (error) {
    res.setHeader('Content-Type', 'application/json');
    res.status(500).res.json({ Error: 'Error interno del servidor' });
  }
});

router.get('/productos', async (req, res) => {
  let carrito = await cartManager.getOneBy();
  if (!carrito) {
    carrito = await cartManager.createCart();
  }

  let productos;
  try {
    productos = await productManager.getAll();
  } catch (error) {
    console.log(error);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({
      error: `Error interno del servidor`,
      detalle: `${error.message}`,
    });
  }

  res.setHeader('Content-Type', 'text/html');
  res.status(200).render('productos', {
    productos,
    carritoId: carrito._id,
  });
});
