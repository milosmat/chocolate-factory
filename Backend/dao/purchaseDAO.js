const path = require("path");
const fs = require('fs');
const Serializer = require("../serializer/serializer");
const Purchase = require("../models/Purchase");

class PurchaseDAO {
  constructor() {
    this.filePath = path.join(__dirname, "../data/purchase.csv");
    this.serializer = new Serializer();
    this.purchases = this.loadFromCSV();
  }

  async createPurchase(purchaseData) {
    const purchase = new Purchase(purchaseData);
    purchase.id = this.getNextId();
    this.purchases.push(purchase);
    this.saveToCSV();
    return purchase;
  }

  async getAllPurchases() {
    return this.purchases;
  }

  async getPurchaseById(purchaseId) {
    return this.purchases.find((purchase) => purchase.id === purchaseId);
  }

  async updatePurchase(purchaseId, updateData) {
    const purchaseIndex = this.purchases.findIndex((purchase) => purchase.id === purchaseId);
    if (purchaseIndex !== -1) {
      this.purchases[purchaseIndex] = { ...this.purchases[purchaseIndex], ...updateData };
      this.saveToCSV();
      return this.purchases[purchaseIndex];
    }
    return null;
  }

  async deletePurchase(purchaseId) {
    const purchaseIndex = this.purchases.findIndex((purchase) => purchase.id === purchaseId);
    if (purchaseIndex !== -1) {
      this.purchases.splice(purchaseIndex, 1);
      this.saveToCSV();
      return true;
    }
    return false;
  }

  saveToCSV() {
    this.serializer.toCSV(this.filePath, this.purchases);
  }

  loadFromCSV() {
    if (fs.existsSync(this.filePath)) {
      return this.serializer.fromCSV(this.filePath, Purchase);
    } else {
      console.log("CSV file not found.");
      return [];
    }
  }

  getNextId() {
    const maxId = this.purchases.reduce((max, purchase) => {
      return Math.max(max, parseInt(purchase.id, 10));
    }, 0);
    return (maxId + 1).toString();
  }
}

module.exports = new PurchaseDAO();
