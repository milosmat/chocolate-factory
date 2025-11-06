const customerTypeService = require('../services/customerTypeService');

exports.createCustomerType = async (req, res) => {
  try {
    const customerType = await customerTypeService.createCustomerType(req.body);
    res.status(201).json(customerType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getCustomerTypeById = async (req, res) => {
  try {
    const customerType = await customerTypeService.getCustomerTypeById(req.params.id);
    if (!customerType) {
      return res.status(404).json({ message: 'Customer Type not found' });
    }
    res.json(customerType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getCustomerTypes = async (req, res) => {
  try {
    const customerTypes = await customerTypeService.getCustomerTypes();
    res.json(customerTypes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateCustomerType = async (req, res) => {
  try {
    const customerType = await customerTypeService.updateCustomerType(req.params.id, req.body);
    if (!customerType) {
      return res.status(404).json({ message: 'Customer Type not found' });
    }
    res.json(customerType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteCustomerType = async (req, res) => {
  try {
    const customerType = await customerTypeService.deleteCustomerType(req.params.id);
    if (!customerType) {
      return res.status(404).json({ message: 'Customer Type not found' });
    }
    res.json({ message: 'Customer Type deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
