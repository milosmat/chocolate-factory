const path = require('path');
const fs = require('fs');
const Serializer = require('../serializer/serializer');
const Chocolate = require('../models/Chocolate');

class ChocolateDAO {
  constructor() {
    this.filePath = path.join(__dirname, '../data/chocolate.csv');
    this.serializer = new Serializer();
    this.chocolates = this.loadFromCSV();
  }

  async createChocolate(chocolateData) {
    const chocolate = new Chocolate(chocolateData);
    chocolate.id = this.getNextId();
    this.chocolates.push(chocolate);
    this.saveToCSV();
    return chocolate;
  }

  async getAllChocolates() {
    return this.chocolates;
  }

  async getChocolatesByFactoryId(factoryId) {
    return this.chocolates.filter(chocolate => chocolate.factoryId === factoryId);
  }

  async getChocolateById(chocolateId) {
    return this.chocolates.find(chocolate => chocolate.id === chocolateId);
  }

  async updateChocolate(chocolateId, updateData) {
    const chocolateIndex = this.chocolates.findIndex((chocolate) => chocolate.id === chocolateId);
    if (chocolateIndex !== -1) {
      const updatedChocolate = new Chocolate({ ...this.chocolates[chocolateIndex], ...updateData });
      this.chocolates[chocolateIndex] = updatedChocolate;
      this.saveToCSV();
      return updatedChocolate;
    }
    return null;
  }

  async deleteChocolate(chocolateId) {
    const chocolateIndex = this.chocolates.findIndex(chocolate => chocolate.id === chocolateId);
    if (chocolateIndex !== -1) {
      this.chocolates.splice(chocolateIndex, 1);
      this.saveToCSV();
      return true;
    }
    return false;
  }

  saveToCSV() {
    this.serializer.toCSV(this.filePath, this.chocolates);
  }

  loadFromCSV() {
    if (fs.existsSync(this.filePath)) {
      return this.serializer.fromCSV(this.filePath, Chocolate);
    } else {
      console.log('CSV file not found.');
      return [];
    }
  }

  getNextId() {
    const maxId = this.chocolates.reduce((max, chocolate) => {
      return Math.max(max, parseInt(chocolate.id, 10));
    }, 0);
    return (maxId + 1).toString();
  }
}

module.exports = new ChocolateDAO();
