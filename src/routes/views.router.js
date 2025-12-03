import { Router } from 'express';
import ProductManagerMongo from '../dao/ProductManagerMongo.js';
import CartManagerMongo from '../dao/CartManagerMongo.js';
import { CartModel } from "../models/cart.model.js";

const router = Router();
const productService = new ProductManagerMongo();
const cartService = new CartManagerMongo();

// Home o redirección a /products
router.get('/', (req, res) => {
  res.redirect('/products');
});

// Vista productos con paginación
router.get('/products', async (req, res) => {
  try {
    let { limit = 10, page = 1, sort, query } = req.query;
    limit = Number(limit) || 10;
    page = Number(page) || 1;

    const result = await productService.getProducts({
      limit,
      page,
      sort,
      query,
    });

    const carts = await CartModel.find().lean();

    res.render('products', {
      products: result.products,
      carts,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      sort,
      query,
    });
  } catch (error) {
    console.error('Error en vista /products', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Vista detalle de producto (opcional)
router.get('/products/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productService.getProductById(pid);
    if (!product) return res.status(404).send('Producto no encontrado');

    res.render('productDetails', { product });
  } catch (error) {
    console.error('Error en vista /products/:pid', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Vista de un carrito específico
router.get('/carts/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartService.getCartById(cid);
    if (!cart) return res.status(404).send('Carrito no encontrado');

    res.render('cart', { cart });
  } catch (error) {
    console.error('Error en vista /carts/:cid', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Mantienes tu vista de realtime
router.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts');
});

export default router;
