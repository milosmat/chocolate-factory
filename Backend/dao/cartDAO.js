const path = require("path");
const fs = require('fs');
const Serializer = require("../serializer/serializer");
const Cart = require("../models/Cart");

class CartDAO {
  constructor() {
    this.filePath = path.join(__dirname, "../data/cart.csv");
    this.serializer = new Serializer();
    this.carts = this.loadFromCSV();
  }

  async createCart(cartData) {
    const cart = new Cart(cartData);
    cart.id = this.getNextId();
    this.carts.push(cart);
    this.saveToCSV();
    return cart;
  }

  async getAllCarts() {
    return this.carts;
  }

  async getCartById(cartId) {
    return this.carts.find((cart) => cart.id === cartId);
  }

  async updateCart(cartId, updateData) {
    const cartIndex = this.carts.findIndex((cart) => cart.id === cartId);
    if (cartIndex !== -1) {
      this.carts[cartIndex] = { ...this.carts[cartIndex], ...updateData };
      this.saveToCSV();
      return this.carts[cartIndex];
    }
    return null;
  }

  async deleteCart(cartId) {
    const cartIndex = this.carts.findIndex((cart) => cart.id === cartId);
    if (cartIndex !== -1) {
      this.carts.splice(cartIndex, 1);
      this.saveToCSV();
      return true;
    }
    return false;
  }

  saveToCSV() {
    this.serializer.toCSV(this.filePath, this.carts);
  }

  loadFromCSV() {
    if (fs.existsSync(this.filePath)) {
      return this.serializer.fromCSV(this.filePath, Cart);
    } else {
      console.log("CSV file not found.");
      return [];
    }
  }

  getNextId() {
    const maxId = this.carts.reduce((max, cart) => {
      return Math.max(max, parseInt(cart.id, 10));
    }, 0);
    return (maxId + 1).toString();
  }
}

module.exports = new CartDAO();
