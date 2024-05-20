import { Router } from 'express';
import ProductManagerMongo from '../dao/productManagerMONGO.js';
import { auth } from '../middleware/auth.js';

const productManager = new ProductManagerMongo();

export const router = Router();

router.get('/', async (req, res) => {
  const products = await productManager.getProducts();
  res.json({ products });
});

router.get('/:pid', async (req, res) => {
  const productfind = await productManager.getProductById(req.params);
  res.json({ status: 'success', productfind });
});

router.put('/:pid', async (req, res) => {
  const updatedproduct = await productManager.updateProduct(
    req.params,
    req.body
  );
  res.json({ status: 'success', updatedproduct });
});

router.delete('/:pid', async (req, res) => {
  const id = parseInt(req.params.pid);
  const deleteproduct = await productManager.deleteProductById(id);
  res.json({ status: 'success', deleteproduct });
});

router.post('/', auth, async (req, res) => {
  let { title, ...otrasPropiedades } = req.body;

  if (!title) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(400).json({ error: `titulo es requerido` });
  }

  let existe;

  try {
    existe = await productManager.getOneBy({ title });
  } catch (error) {
    console.log(error);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({
      error: `Error en el servidor`,
      detalle: `${error.message}`,
    });
  }

  if (existe) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(400).json({ error: `Ya existe ${title} en BD` });
  }

  try {
    let newProduct = await productManager.create({
      title,
      ...otrasPropiedades,
    });
    res.setHeader('Content-Type', 'application/json');
    return res.status(201).json({ newProduct });
  } catch (error) {
    console.log(error);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({
      error: `Error en el servidor`,
      detalle: `${error.message}`,
    });
  }
});
