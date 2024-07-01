const express = require('express');
const router = express.Router();
const chocolateFactoryController = require('../controllers/chocolateFactoryController');
const userController = require('../controllers/userController');

router.post('/', chocolateFactoryController.createChocolateFactory);
router.get('/:id', chocolateFactoryController.getChocolateFactoryById);
router.get('/', chocolateFactoryController.getChocolateFactories);
router.put('/:id', chocolateFactoryController.updateChocolateFactory);
router.delete('/:id', chocolateFactoryController.deleteChocolateFactory);
router.get('/managers/available', userController.getAvailableManagers);

module.exports = router;
