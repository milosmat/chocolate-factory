const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

router.post('/create', userController.createUser);
router.get('/:id', authMiddleware, userController.getUserById);
router.get('/', authMiddleware, userController.getUsers);
router.put('/:id', authMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, userController.deleteUser);
router.put('/:userId/change-password', userController.changePassword);
router.get('/rest/suspicious-users', authMiddleware, userController.getSuspiciousUsers);
router.put('/block-user/:id', authMiddleware, userController.blockUser);
module.exports = router;
