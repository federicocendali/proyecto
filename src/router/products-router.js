import { Router } from 'express';
import { ProductController } from '../controllers/ProductController.js';
import { authToken } from '../middleware/auth.js';

export const router = Router();

router.get('/', ProductController.getProduct);
router.get('/mockingProducts', ProductController.mockProducts);
router.post('/', authToken, ProductController.addProduct);
router.get('/:pid', ProductController.getProductById);
router.put('/:pid', ProductController.updateProduct);
router.delete('/:pid', ProductController.deleteById);
