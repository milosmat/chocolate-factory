const path = require("path");
const fs = require('fs');
const Serializer = require("../serializer/serializer");
const CustomerType = require("../models/CustomerType");

class CustomerTypeDAO {
  constructor() {
    this.filePath = path.join(__dirname, "../data/customerType.csv");
    this.serializer = new Serializer();
    this.customerTypes = this.loadFromCSV();
  }

  async createCustomerType(customerTypeData) {
    const customerType = new CustomerType(customerTypeData);
    customerType.id = this.getNextId();
    this.customerTypes.push(customerType);
    this.saveToCSV();
    return customerType;
  }

  async getAllCustomerTypes() {
    return this.customerTypes;
  }

  async getCustomerTypeById(customerTypeId) {
    return this.customerTypes.find((customerType) => customerType.id === customerTypeId);
  }

  async updateCustomerType(customerTypeId, updateData) {
    const customerTypeIndex = this.customerTypes.findIndex((customerType) => customerType.id === customerTypeId);
    if (customerTypeIndex !== -1) {
      this.customerTypes[customerTypeIndex] = { ...this.customerTypes[customerTypeIndex], ...updateData };
      this.saveToCSV();
      return this.customerTypes[customerTypeIndex];
    }
    return null;
  }

  async deleteCustomerType(customerTypeId) {
    const customerTypeIndex = this.customerTypes.findIndex((customerType) => customerType.id === customerTypeId);
    if (customerTypeIndex !== -1) {
      this.customerTypes.splice(customerTypeIndex, 1);
      this.saveToCSV();
      return true;
    }
    return false;
  }

  saveToCSV() {
    this.serializer.toCSV(this.filePath, this.customerTypes);
  }

  loadFromCSV() {
    if (fs.existsSync(this.filePath)) {
      return this.serializer.fromCSV(this.filePath, CustomerType);
    } else {
      console.log("CSV file not found.");
      return [];
    }
  }

  getNextId() {
    const maxId = this.customerTypes.reduce((max, customerType) => {
      return Math.max(max, parseInt(customerType.id, 10));
    }, 0);
    return (maxId + 1).toString();
  }
}

module.exports = new CustomerTypeDAO();
