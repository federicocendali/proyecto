import { Router } from 'express';
import { CartController } from '../controllers/CartController.js';
import { authToken } from '../middleware/auth.js';

export const router = Router();

router.get('/', CartController.getAll);
router.get('/:cid', CartController.getById);
router.post('/', CartController.createNewCart);
router.post('/:cid/products/:pid', CartController.addProductToCart);
router.delete('/:cid/products/:pid', CartController.deleteProductByCart);
router.delete('/:cid', CartController.deleteCartById);
router.put('/:cId/products/:pId', CartController.updateProduct);
router.post('/:cid/purchase', authToken, CartController.purchase);
