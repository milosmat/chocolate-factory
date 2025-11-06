// backend/routes/purchaseRoutes.js
const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');

router.post('/', purchaseController.createPurchase);
router.get('/:id', purchaseController.getPurchaseById);
router.get('/', purchaseController.getPurchases);
router.put('/:id', purchaseController.updatePurchase);
router.delete('/:id', purchaseController.deletePurchase);

module.exports = router;
