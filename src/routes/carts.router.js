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

// PUT api/carts/:cid -> reemplazar todos los productos
router.put('/:cid', updateCartProducts);

// PUT api/carts/:cid/products/:pid -> actualizar cantidad
router.put('/:cid/products/:pid', updateProductQuantity);

// DELETE api/carts/:cid/products/:pid
router.delete('/:cid/products/:pid', deleteProductFromCart);

// DELETE api/carts/:cid -> eliminar todos los productos
router.delete('/:cid', clearCart);

export default router;
