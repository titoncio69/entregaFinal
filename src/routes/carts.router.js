import { Router } from 'express';
import {
  getCart,
  createCart,
  addProductToCart,
  updateCartProducts,
  updateProductQuantity,
  deleteProductFromCart,
  clearCart,
} from '../controllers/carts.controller.js';

const router = Router();

router.post('/', createCart);
router.get('/:cid', getCart);

router.post('/:cid/products/:pid', addProductToCart);

router.put('/:cid', updateCartProducts);

router.put('/:cid/products/:pid', updateProductQuantity);

router.delete('/:cid/products/:pid', deleteProductFromCart);

router.delete('/:cid', clearCart);

export default router;
