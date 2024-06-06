const customerTypeDAO = require('../dao/customerTypeDAO');

class CustomerTypeService {
  async createCustomerType(customerTypeData) {
    return await customerTypeDAO.createCustomerType(customerTypeData);
  }

  async getCustomerTypeById(customerTypeId) {
    return await customerTypeDAO.getCustomerTypeById(customerTypeId);
  }

  async getCustomerTypes() {
    return await customerTypeDAO.getAllCustomerTypes();
  }

  async updateCustomerType(customerTypeId, updateData) {
    return await customerTypeDAO.updateCustomerType(customerTypeId, updateData);
  }

  async deleteCustomerType(customerTypeId) {
    return await customerTypeDAO.deleteCustomerType(customerTypeId);
  }
}

module.exports = new CustomerTypeService();
