const express = require('express');
const router = express.Router();
const chocolateFactoryController = require('../controllers/chocolateFactoryController');

router.post('/', chocolateFactoryController.createChocolateFactory);
router.get('/:id', chocolateFactoryController.getChocolateFactoryById);
router.get('/', chocolateFactoryController.getChocolateFactories);
router.put('/:id', chocolateFactoryController.updateChocolateFactory);
router.delete('/:id', chocolateFactoryController.deleteChocolateFactory);

module.exports = router;
