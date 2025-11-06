const purchaseService = require('../services/purchaseService');

exports.createPurchase = async (req, res) => {
  try {
    const purchase = await purchaseService.createPurchase(req.body);
    res.status(201).json(purchase);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getPurchaseById = async (req, res) => {
  try {
    const purchase = await purchaseService.getPurchaseById(req.params.id);
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    res.json(purchase);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getPurchases = async (req, res) => {
  try {
    const purchases = await purchaseService.getPurchases();
    res.json(purchases);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updatePurchase = async (req, res) => {
  try {
    const purchase = await purchaseService.updatePurchase(req.params.id, req.body);
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    res.json(purchase);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deletePurchase = async (req, res) => {
  try {
    const purchase = await purchaseService.deletePurchase(req.params.id);
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    res.json({ message: 'Purchase deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getFactoryPurchasesByManager = async (req, res) => {
  try {
    const { factoryId, managerId } = req.params;
    const purchases = await purchaseService.getPurchasesByFactoryAndManager(factoryId, managerId);
    res.json(purchases);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getPurchasesByUser = async (req, res) => {
  try {
    const purchases = await purchaseService.getPurchasesByUser(req.params.userId);
    res.json(purchases);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const userId = req.params.userId;
    const purchaseId = req.params.purchaseId;
    const result = await purchaseService.cancelOrder(userId, purchaseId);
    res.json({ message: 'Order cancelled successfully', result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updatePurchaseStatus = async (req, res) => {
  try {
    const { factoryId, managerId, purchaseId } = req.params;
    const { status, managerMessage } = req.body;

    // Pozivamo servisnu funkciju da ažuriramo status porudžbine
    const updatedPurchase = await purchaseService.updatePurchaseStatus(factoryId, managerId, purchaseId, status, managerMessage);

    // Ako porudžbina nije pronađena ili menadžer nije zadužen za ovu fabriku
    if (!updatedPurchase) {
      return res.status(404).json({ message: 'Porudžbina nije pronađena ili nemate dozvolu da ažurirate ovu porudžbinu.' });
    }

    res.json(updatedPurchase);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};