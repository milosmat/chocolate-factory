const cartDAO = require('../dao/cartDAO');

class CartService {
  async createCart(cartData) {
    return await cartDAO.createCart(cartData);
  }

  async getCartById(cartId) {
    return await cartDAO.getCartById(cartId);
  }

  async getCarts() {
    return await cartDAO.getAllCarts();
  }

  async updateCart(cartId, updateData) {
    return await cartDAO.updateCart(cartId, updateData);
  }

  async deleteCart(cartId) {
    return await cartDAO.deleteCart(cartId);
  }
}

module.exports = new CartService();
