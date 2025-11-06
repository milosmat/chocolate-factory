const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/', cartController.createCart);
router.get('/:id', cartController.getCartById);
router.get('/', cartController.getCarts);
router.put('/:id', cartController.updateCart);
router.delete('/:id', cartController.deleteCart);
router.get('/user/:userId/my-cart', cartController.getCartByUserAndOrder);
router.post('/user/:userId', cartController.addToCart);
router.put('/user/:userId/cart/:cartId/update-quantity', cartController.updateQuantity);
router.delete('/user/:userId/cart/:cartId/remove', cartController.deleteCart);
router.put('/user/:userId/place-order', cartController.placeOrder);

module.exports = router;
