const cartDAO = require('../dao/cartDAO');
const chocolateDAO = require('../dao/chocolateDAO');
const purchaseDAO = require('../dao/purchaseDAO');
const userDAO = require('../dao/userDAO');
const moment = require('moment');

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
    const cart = await cartDAO.getCartById(cartId);
    if (!cart) {
      throw new Error('Cart not found');
    }
    return await cartDAO.deleteCart(cartId);
  }

  async getCartByUser(userId) {
    return await cartDAO.getCartByUser(userId);
  }

  async getCartByUserAndOrder(userId) {
    return await cartDAO.getCartByUserAndOrder(userId);
  }

  async addToCart(userId, chocolateId, quantity) {
    let cart = await cartDAO.getCartByUser(userId);
    cart = cart.find(c => !c.isOrdered); // Pronalazimo neizvršenu korpu
  
    const chocolate = await chocolateDAO.getChocolateById(chocolateId);
  
    if (!chocolate) {
      throw new Error('Chocolate not found');
    }
  
    if (quantity > chocolate.quantity) {
      throw new Error('Not enough chocolate in stock');
    }
  
    if (!cart) {
      cart = await cartDAO.createCart({
        chocolates: [],
        user: userId,
        totalPrice: 0,
        isOrdered: 'false',
        itemQuantity: []
      });
    }
  
    // Pronađi indeks čokolade u korpi
    let cartItemIndex = cart.chocolates.findIndex(item => item === chocolateId);
  
    if (cartItemIndex !== -1) {
      cart.itemQuantity[cartItemIndex] += quantity;
    } else {
      cart.chocolates.push(chocolateId);
      cart.itemQuantity.push(quantity);
    }
  
    // Ažuriranje ukupne cene korpe
    cart.totalPrice += chocolate.price * quantity;
    await cartDAO.updateCart(cart);
  
    return cart;
  }

  async updateQuantity(userId, cartId, chocolateId, quantity) {
    const cart = await cartDAO.getCartById(cartId);
    
    if (!cart || cart.user !== userId) {
      throw new Error('Active cart item not found');
    }
  
    const cartItemIndex = cart.chocolates.indexOf(chocolateId);
    if (cartItemIndex !== -1) {
      cart.itemQuantity[cartItemIndex] = quantity;
    }
  
    cart.totalPrice = await cart.chocolates.reduce(async (total, chocoId, index) => {
      const chocolate = await chocolateDAO.getChocolateById(chocoId);
      return total + chocolate.price * cart.itemQuantity[index];
    }, 0);
  
    await cartDAO.updateCart(cart);
  }

  async placeOrder(userId) {
    const carts = await cartDAO.getCartByUser(userId);
    const activeCart = carts.find(cart => cart.isOrdered === 'false');

    if (!activeCart) {
        throw new Error('No active cart found');
    }

    // Set the cart as ordered
    activeCart.isOrdered = 'true';
    await cartDAO.updateCart(activeCart);

    console.log("Cokolada id: " + activeCart.chocolates[0]);
    const chocolate = await chocolateDAO.getChocolateById(activeCart.chocolates[0]);
    console.log("Chocolate: ", chocolate);

    if (!chocolate) {
        throw new Error('Chocolate not found');
    }

    const factoryId = chocolate.factoryId;
    console.log("id fabrike: " + factoryId);

    // Formatiraj datum samo kao YYYY-MM-DD
    const formattedDate = moment().format('YYYY-MM-DD');

    // Create a new purchase
    const purchase = {
        purchaseId: activeCart.id,
        chocolates: activeCart.chocolates,
        factory: factoryId,
        dateTime: formattedDate,
        totalPrice: activeCart.totalPrice,
        customer: userId,
        status: 'Obrada'
    };
    const customer = await userDAO.getUserById(userId);
    customer.points +=  activeCart.totalPrice/1000 * 133
    userDAO.updateUser(userId, customer);
    await purchaseDAO.createPurchase(purchase);

    return activeCart;
  }
}

module.exports = new CartService();
