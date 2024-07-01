const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

// Create a new user
router.post('/create', userController.createUser);

// Get user by ID
router.get('/:id', authMiddleware, userController.getUserById);

// Get all users
router.get('/', authMiddleware, userController.getUsers);

// Update user by ID
router.put('/:id', authMiddleware, userController.updateUser);

// Delete user by ID
router.delete('/:id', authMiddleware, userController.deleteUser);

module.exports = router;
