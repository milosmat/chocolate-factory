// backend/routes/customerTypeRoutes.js
const express = require('express');
const router = express.Router();
const customerTypeController = require('../controllers/customerTypeController');

router.post('/', customerTypeController.createCustomerType);
router.get('/:id', customerTypeController.getCustomerTypeById);
router.get('/', customerTypeController.getCustomerTypes);
router.put('/:id', customerTypeController.updateCustomerType);
router.delete('/:id', customerTypeController.deleteCustomerType);

module.exports = router;
