import CartManagerMongo from '../dao/CartManagerMongo.js';

const cartService = new CartManagerMongo();

export const getCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartService.getCartById(cid);
    if (!cart)
      return res
        .status(404)
        .json({ status: 'error', error: 'Cart not found' });

    res.json({ status: 'success', payload: cart });
  } catch (error) {
    console.error('Error en getCart', error);
    res.status(500).json({ status: 'error', error: 'Internal server error' });
  }
};

export const createCart = async (req, res) => {
  try {
    const cart = await cartService.createCart();
    res.status(201).json({ status: 'success', payload: cart });
  } catch (error) {
    console.error('Error en createCart', error);
    res.status(500).json({ status: 'error', error: 'Internal server error' });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity = 1 } = req.body;
    const cart = await cartService.addProductToCart(cid, pid, quantity);
    if (!cart)
      return res
        .status(404)
        .json({ status: 'error', error: 'Cart not found' });

    res.json({ status: 'success', payload: cart });
  } catch (error) {
    console.error('Error en addProductToCart', error);
    res.status(500).json({ status: 'error', error: 'Internal server error' });
  }
};

// PUT api/carts/:cid -> reemplazar todo el arreglo de productos
export const updateCartProducts = async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body; // [{ product: pid, quantity }, ...]

    const cart = await cartService.updateCartProducts(cid, products);
    if (!cart)
      return res
        .status(404)
        .json({ status: 'error', error: 'Cart not found' });

    res.json({ status: 'success', payload: cart });
  } catch (error) {
    console.error('Error en updateCartProducts', error);
    res.status(500).json({ status: 'error', error: 'Internal server error' });
  }
};

// PUT api/carts/:cid/products/:pid -> actualizar SOLO cantidad
export const updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cart = await cartService.updateProductQuantity(cid, pid, quantity);
    if (!cart)
      return res.status(404).json({
        status: 'error',
        error: 'Cart or product not found in cart',
      });

    res.json({ status: 'success', payload: cart });
  } catch (error) {
    console.error('Error en updateProductQuantity', error);
    res.status(500).json({ status: 'error', error: 'Internal server error' });
  }
};

// DELETE api/carts/:cid/products/:pid -> eliminar producto específico
export const deleteProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartService.deleteProductFromCart(cid, pid);
    if (!cart)
      return res.status(404).json({
        status: 'error',
        error: 'Cart or product not found in cart',
      });

    res.json({ status: 'success', payload: cart });
  } catch (error) {
    console.error('Error en deleteProductFromCart', error);
    res.status(500).json({ status: 'error', error: 'Internal server error' });
  }
};

// DELETE api/carts/:cid -> eliminar todos los productos
export const clearCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartService.clearCart(cid);
    if (!cart)
      return res
        .status(404)
        .json({ status: 'error', error: 'Cart not found' });

    res.json({ status: 'success', payload: cart });
  } catch (error) {
    console.error('Error en clearCart', error);
    res.status(500).json({ status: 'error', error: 'Internal server error' });
  }
};
