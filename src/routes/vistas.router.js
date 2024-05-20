import { Router } from 'express';
import ProductManagerMONGO from '../dao/productManagerMONGO.js';
import CartManager from '../dao/cartManagerMONGO.js';
import { auth, sessionOn } from '../middleware/auth.js';
export const router = Router();

const productManager = new ProductManagerMONGO();
const cartManager = new CartManager();

router.get('/realTimeproducts', async (req, res) => {
  res.status(200).render('realTimeProducts');
});

router.get('/', auth, async (req, res) => {
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

    let mensajeBienvenida = null;
    const usuarioEnSesion = req.session.usuario;

    if (usuarioEnSesion && !req.session.mensajeBienvenidaMostrado) {
      mensajeBienvenida = `¡Bienvenido de nuevo:  ${usuarioEnSesion.nombre}!`;
      req.session.mensajeBienvenidaMostrado = true;
    }

    res.setHeader('Content-Type', 'text/html');
    res.status(200).render('inicio', {
      mensajeBienvenida: mensajeBienvenida,
      listOfProducts: filteredProducts,
      totalPages,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
      login: req.session.usuario,
    });
  } catch (error) {
    console.error('Error al obtener los productos paginados:', error);
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
        prevLink: 'En construcción',
        nextLink: 'En construcción',
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
    console.error('Error al obtener los productos paginados:', error);
    res.status(500).send('Error interno del servidor');
  }
});

router.get('/carrito/:cid', async (req, res) => {
  let id = req.params.cid;
  let products;

  try {
    let carrito = await cartManager.getCartById(id);
    console.log(carrito._id, 'acacacacac');
    products = carrito.products;
    res.setHeader('Content-Type', 'text/html');
    res.status(200).render('carrito', { products });
  } catch (error) {
    res.setHeader('Content-Type', 'application/json');
    res.status(500).res.json({ Error: 'Error en el servidor' });
  }
});

router.get('/productos', auth, async (req, res) => {
  let carrito = {
    id: req.session.usuario.carritoId,
  };
  let productos;

  try {
    productos = await productManager.getAll();
  } catch (error) {
    console.log(error);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({
      error: `Error en el servidor`,
      detalle: `${error.message}`,
    });
  }

  res.setHeader('Content-Type', 'text/html');
  res.status(200).render('productos', {
    productos,
    carrito,
  });
});

router.get('/register', sessionOn, (req, res) => {
  let { error } = req.query;
  res.setHeader('Content-Type', 'text/html');
  res.status(200).render('register', { error, login: req.session.usuario });
});
router.get('/login', sessionOn, (req, res) => {
  let { error, mensaje } = req.query;
  res
    .status(200)
    .render('login', { error, mensaje, login: req.session.usuario });
});
router.get('/profile', auth, (req, res) => {
  const { usuario } = req.session;
  res.setHeader('Content-Type', 'text/html');
  res.status(200).render('profile', { usuario, login: usuario });
});
