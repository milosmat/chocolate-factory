const cartService = require('../services/cartService');

exports.createCart = async (req, res) => {
  try {
    const userId = req.user.id; // Pretpostavljamo da je ID korisnika dostupan u req.user
    const cartData = { ...req.body, user: userId };
    const cart = await cartService.createCart(cartData);
    res.status(201).json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getCartById = async (req, res) => {
  try {
    const cart = await cartService.getCartById(req.params.id);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getCarts = async (req, res) => {
  try {
    const carts = await cartService.getCarts();
    res.json(carts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const cart = await cartService.updateCart(req.params.id, req.body);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const cartId = req.params.cartId; // Proveri da li je cartId ispravno uzet iz parametara
    console.log('Deleting cart with ID:', cartId); // Dodaj logovanje za proveru
    const cart = await cartService.deleteCart(cartId);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.json({ message: 'Cart deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.getCartByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const carts = await cartService.getCartByUser(userId);
    res.json(carts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getCartByUserAndOrder = async (req, res) => {
  try {
    const userId = req.params.userId;
    const carts = await cartService.getCartByUserAndOrder(userId);
    res.json(carts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.addToCart = async (req, res) => {
  const { userId } = req.params;
  const { chocolateId, quantity } = req.body;

  try {
    const updatedCart = await cartService.addToCart(userId, chocolateId, quantity);
    res.json(updatedCart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateQuantity = async (req, res) => {
  try {
    const { userId, cartId } = req.params;
    const { chocolateId, quantity } = req.body;

    await cartService.updateQuantity(userId, cartId, chocolateId, quantity);
    res.status(200).send({ message: 'Quantity updated successfully' });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.placeOrder = async (req, res) => {
  try {
    const userId = req.params.userId;
    const carts = await cartService.placeOrder(userId);
    res.json({ message: 'Order placed successfully', carts });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};