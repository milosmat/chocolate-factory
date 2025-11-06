const chocolateFactoryService = require('../services/chocolateFactoryService');

exports.createChocolateFactory = async (req, res) => {
  try {
    const factory = await chocolateFactoryService.createChocolateFactory(req.body);
    res.status(201).json(factory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getChocolateFactoryById = async (req, res) => {
  try {
    const factory = await chocolateFactoryService.getChocolateFactoryById(req.params.id);
    if (!factory) {
      return res.status(404).json({ message: 'Chocolate factory not found' });
    }
    res.json(factory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getChocolateFactories = async (req, res) => {
  try {
    const factories = await chocolateFactoryService.getChocolateFactories();
    res.json(factories);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateChocolateFactory = async (req, res) => {
  try {
    const factory = await chocolateFactoryService.updateChocolateFactory(req.params.id, req.body);
    if (!factory) {
      return res.status(404).json({ message: 'Chocolate factory not found' });
    }
    res.json(factory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteChocolateFactory = async (req, res) => {
  try {
    const factory = await chocolateFactoryService.deleteChocolateFactory(req.params.id);
    if (!factory) {
      return res.status(404).json({ message: 'Chocolate factory not found' });
    }
    res.json({ message: 'Chocolate factory deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
