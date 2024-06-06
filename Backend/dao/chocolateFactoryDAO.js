const path = require("path");
const fs = require('fs');
const Serializer = require("../serializer/serializer");
const ChocolateFactory = require("../models/ChocolateFactory");

class ChocolateFactoryDAO {
  constructor() {
    this.filePath = path.join(__dirname, "../data/chocolateFactory.csv");
    this.serializer = new Serializer();
    this.factories = this.loadFromCSV();
  }

  async createChocolateFactory(factoryData) {
    const factory = new ChocolateFactory(factoryData);
    factory.id = this.getNextId();
    this.factories.push(factory);
    this.saveToCSV();
    return factory;
  }

  async getAllChocolateFactories() {
    return this.factories;
  }

  async getChocolateFactoryById(factoryId) {
    return this.factories.find((factory) => factory.id === factoryId);
  }

  async updateChocolateFactory(factoryId, updateData) {
    const factoryIndex = this.factories.findIndex((factory) => factory.id === factoryId);
    if (factoryIndex !== -1) {
      this.factories[factoryIndex] = { ...this.factories[factoryIndex], ...updateData };
      this.saveToCSV();
      return this.factories[factoryIndex];
    }
    return null;
  }

  async deleteChocolateFactory(factoryId) {
    const factoryIndex = this.factories.findIndex((factory) => factory.id === factoryId);
    if (factoryIndex !== -1) {
      this.factories.splice(factoryIndex, 1);
      this.saveToCSV();
      return true;
    }
    return false;
  }

  saveToCSV() {
    this.serializer.toCSV(this.filePath, this.factories);
  }

  loadFromCSV() {
    if (fs.existsSync(this.filePath)) {
      return this.serializer.fromCSV(this.filePath, ChocolateFactory);
    } else {
      console.log("CSV file not found.");
      return [];
    }
  }

  getNextId() {
    const maxId = this.factories.reduce((max, factory) => {
      return Math.max(max, parseInt(factory.id, 10));
    }, 0);
    return (maxId + 1).toString();
  }
}

module.exports = new ChocolateFactoryDAO();
