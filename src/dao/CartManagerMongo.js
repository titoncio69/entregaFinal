import { CartModel } from '../models/cart.model.js';

export default class CartManagerMongo {
  async getCartById(cid) {
    return CartModel.findById(cid).populate('products.product').lean();
  }

  async createCart() {
    const cart = await CartModel.create({ products: [] });
    return cart.toObject();
  }

  async addProductToCart(cid, pid, quantity = 1) {
  const cart = await CartModel.findById(cid);
  if (!cart) return null;

  cart.products = cart.products.filter(p => p.product);

  const existing = cart.products.find(
    (p) => p.product.toString() === pid
  );

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.products.push({ product: pid, quantity });
  }

  await cart.save();
  return cart;
}

  async updateCartProducts(cid, products) {
    const cart = await CartModel.findById(cid);
    if (!cart) return null;

    cart.products = products;
    await cart.save();
    return cart;
  }

  async updateProductQuantity(cid, pid, quantity) {
    const cart = await CartModel.findById(cid);
    if (!cart) return null;

    const existing = cart.products.find((p) => p.product.toString() === pid);
    if (!existing) return null;

    existing.quantity = quantity;
    await cart.save();
    return cart;
  }

  async deleteProductFromCart(cid, pid) {
    const cart = await CartModel.findById(cid);
    if (!cart) return null;

    cart.products = cart.products.filter(
      (p) => p.product.toString() !== pid
    );
    await cart.save();
    return cart;
  }

  async clearCart(cid) {
    const cart = await CartModel.findById(cid);
    if (!cart) return null;

    cart.products = [];
    await cart.save();
    return cart;
  }
}
