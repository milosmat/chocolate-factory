const customerTypeDAO = require('../dao/customerTypeDAO');
const CustomerType = require('../models/CustomerType');
const customerTypes = [
  new CustomerType({ id: '1', name: 'Regular', discount: 3, requiredPoints: 50 }),
  new CustomerType({ id: '2', name: 'VIP', discount: 5, requiredPoints: 80 })
];
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
  async getCustomerTypeByPoints(points) {
    return customerTypes.find(type => points >= type.requiredPoints) || null;
  }

}

module.exports = new CustomerTypeService();
