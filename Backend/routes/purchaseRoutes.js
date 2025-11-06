// backend/routes/purchaseRoutes.js
const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');

router.post('/', purchaseController.createPurchase);
router.get('/:id', purchaseController.getPurchaseById);
router.get('/', purchaseController.getPurchases);
router.put('/:id', purchaseController.updatePurchase);
router.delete('/:id', purchaseController.deletePurchase);
router.get('/factory/:factoryId/manager/:managerId/purchases', purchaseController.getFactoryPurchasesByManager);
router.get('/user/:userId', purchaseController.getPurchasesByUser);
router.put('/user/:userId/purchase/:purchaseId/cancel-order', purchaseController.cancelOrder);
router.put('/factory/:factoryId/manager/:managerId/purchases/:purchaseId/status', purchaseController.updatePurchaseStatus);

module.exports = router;
