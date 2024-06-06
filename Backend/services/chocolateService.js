const chocolateDAO = require('../dao/chocolateDAO');
const Chocolate = require('../models/Chocolate');

class ChocolateService {
  async createChocolate(chocolateData) {
    chocolateData.quantity = 0;
    chocolateData.status = 'Out of Stock';
    const chocolate = new Chocolate(chocolateData);
    return await chocolateDAO.createChocolate(chocolate);
  }

  async getChocolateById(chocolateId) {
    return await chocolateDAO.getChocolateById(chocolateId);
  }

  async getChocolates() {
    return await chocolateDAO.getAllChocolates();
  }

  async getChocolatesByFactoryId(factoryId) {
    return await chocolateDAO.getChocolatesByFactoryId(factoryId);
  }

  async updateChocolate(chocolateId, updateData) {
    return await chocolateDAO.updateChocolate(chocolateId, updateData);
  }


  async deleteChocolate(chocolateId) {
    return await chocolateDAO.deleteChocolate(chocolateId);
  }
}

module.exports = new ChocolateService();
