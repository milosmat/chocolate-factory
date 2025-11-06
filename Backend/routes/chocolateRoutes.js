const express = require('express');
const router = express.Router();
const chocolateController = require('../controllers/chocolateController');

router.post('/create', chocolateController.createChocolate);
router.get('/:id', chocolateController.getChocolateById);
router.get('/', chocolateController.getChocolates);
router.put('/:id', chocolateController.updateChocolate);
router.delete('/:id', chocolateController.deleteChocolate);

module.exports = router;
