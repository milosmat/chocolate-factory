const chocolateService = require('../services/chocolateService');

exports.createChocolate = async (req, res) => {
  try {
    const chocolate = await chocolateService.createChocolate(req.body);
    res.status(201).json(chocolate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getChocolates = async (req, res) => {
  try {
    const { factoryId } = req.query;
    let chocolates;
    if (factoryId) {
      chocolates = await chocolateService.getChocolatesByFactoryId(factoryId);
    } else {
      chocolates = await chocolateService.getChocolates();
    }
    res.json(chocolates);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getChocolateById = async (req, res) => {
  try {
    const chocolate = await chocolateService.getChocolateById(req.params.id);
    if (!chocolate) {
      return res.status(404).json({ message: 'Chocolate not found' });
    }
    res.json(chocolate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateChocolate = async (req, res) => {
  try {
    const chocolate = await chocolateService.updateChocolate(req.params.id, req.body);
    if (!chocolate) {
      return res.status(404).json({ message: "Chocolate not found" });
    }
    res.json(chocolate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteChocolate = async (req, res) => {
  try {
    const chocolate = await chocolateService.deleteChocolate(req.params.id);
    if (!chocolate) {
      return res.status(404).json({ message: 'Chocolate not found' });
    }
    res.json({ message: 'Chocolate deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
