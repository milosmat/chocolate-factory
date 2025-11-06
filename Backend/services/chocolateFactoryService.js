const chocolateFactoryDAO = require('../dao/chocolateFactoryDAO');

class ChocolateFactoryService {
  async createChocolateFactory(factoryData) {
    return await chocolateFactoryDAO.createChocolateFactory(factoryData);
  }

  async getChocolateFactoryById(factoryId) {
    return await chocolateFactoryDAO.getChocolateFactoryById(factoryId);
  }

  async getChocolateFactories() {
    return await chocolateFactoryDAO.getAllChocolateFactories();
  }

  async updateChocolateFactory(factoryId, updateData) {
    return await chocolateFactoryDAO.updateChocolateFactory(factoryId, updateData);
  }

  async deleteChocolateFactory(factoryId) {
    return await chocolateFactoryDAO.deleteChocolateFactory(factoryId);
  }
}

module.exports = new ChocolateFactoryService();
