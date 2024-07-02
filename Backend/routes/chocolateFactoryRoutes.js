const express = require('express');
const router = express.Router();
const chocolateFactoryController = require('../controllers/chocolateFactoryController');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.post('/', chocolateFactoryController.createChocolateFactory);
router.get('/:id', chocolateFactoryController.getChocolateFactoryById);
router.get('/', chocolateFactoryController.getChocolateFactories);
router.put('/:id', chocolateFactoryController.updateChocolateFactory);
router.delete('/:id', chocolateFactoryController.deleteChocolateFactory);
router.get('/managers/available', userController.getAvailableManagers);
router.get('/rest/search', chocolateFactoryController.searchChocolateFactories);
router.put('/:id/add-worker', auth, chocolateFactoryController.addWorkerToFactory);

module.exports = router;
