const purchaseDAO = require('../dao/purchaseDAO');
const factoryDAO = require('../dao/chocolateFactoryDAO');
const userDAO = require('../dao/userDAO');
const ChocolateDAO = require('../dao/chocolateDAO');
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

  async getPurchasesByUser(userId) {
    return await purchaseDAO.getPurchasesByUser(userId);
  }

  async cancelOrder(userId, purchaseId) {
    const purchase = await purchaseDAO.getPurchaseById(purchaseId);
  
    if (!purchase || purchase.customer !== userId || purchase.status !== 'Obrada') {
      throw new Error('No active order found in processing status for this user');
    }
  
    // Izračunaj izgubljene bodove
    const lostPoints = (purchase.totalPrice / 1000) * 133 * 4;
  
    // Otkazivanje porudžbine
    purchase.status = 'Otkazano';
    await purchaseDAO.updatePurchase(purchase);
  
    // Ažuriraj korisničke bodove (pretpostavimo da postoji metoda za ažuriranje korisničkih bodova)
    const customer = await userDAO.getUserById(userId);
    customer.points -= lostPoints;
    if(customer.points < 0){
      customer.points = 0;
    }
    await userDAO.updateUser(userId, customer);
  
    return purchase;
  }

  async getPurchasesByFactoryAndManager(factoryId, managerId) {
    const factory = await factoryDAO.getChocolateFactoryById(factoryId);

    if (!factory) {
      throw new Error('Factory not found');
    }

    if (factory.managerId !== managerId) {
      throw new Error('Unauthorized: You are not the manager of this factory');
    }

    // Dohvatite sve kupovine
    const allPurchases = await purchaseDAO.getAllPurchases();

    // Filtrirajte kupovine vezane za tu fabriku
    const factoryPurchases = allPurchases.filter(purchase => purchase.factory === factoryId);

    return factoryPurchases;
  }

  async updatePurchaseStatus(factoryId, managerId, purchaseId, status, managerMessage) {
    // Proveri da li je fabrika validna i da li menadžer ima dozvolu za ažuriranje
    const factory = await factoryDAO.getChocolateFactoryById(factoryId);

    if (!factory) {
      throw new Error('Factory not found');
    }

    if (factory.managerId !== managerId) {
      throw new Error('Unauthorized: You are not the manager of this factory');
    }

    // Pronađi porudžbinu po ID-u
    const purchase = await purchaseDAO.getPurchaseById(purchaseId);
    if (!purchase) {
      throw new Error('Purchase not found');
    }

    // Ažuriraj status i poruku menadžera
    purchase.status = status;
    if (status === 'Odbijeno' && managerMessage) {
      purchase.managerMessage = managerMessage;
    }

    if(status === 'Odobreno'){
      const chocoNum = await ChocolateDAO.getChocolateById(purchase.chocolates[0]);
      chocoNum.quantity = chocoNum.quantity - (purchase.totalPrice / chocoNum.price);
      await ChocolateDAO.updateChocolate(chocoNum.id, chocoNum);
    }
    // Sačuvaj izmene
    await purchaseDAO.updatePurchase(purchaseId, purchase);
    return purchase;
  }

}

module.exports = new PurchaseService();
