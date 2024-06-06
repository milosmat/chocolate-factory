const purchaseDAO = require('../dao/purchaseDAO');

class PurchaseService {
  async createPurchase(purchaseData) {
    return await purchaseDAO.createPurchase(purchaseData);
  }

  async getPurchaseById(purchaseId) {
    return await purchaseDAO.getPurchaseById(purchaseId);
  }

  async getPurchases() {
    return await purchaseDAO.getAllPurchases();
  }

  async updatePurchase(purchaseId, updateData) {
    return await purchaseDAO.updatePurchase(purchaseId, updateData);
  }

  async deletePurchase(purchaseId) {
    return await purchaseDAO.deletePurchase(purchaseId);
  }
}

module.exports = new PurchaseService();
