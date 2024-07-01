const chocolateFactoryService = require('../services/chocolateFactoryService');
const multer = require('multer');
const path = require('path');

// Setup multer for file upload
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');  // Uploads folder
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

exports.createChocolateFactory = [
  upload.single('logo'),
  async (req, res) => {
    try {
      const { name, location, workingHours, managerId } = req.body;
      const logo = req.file ? req.file.path : null;

      const existingFactory = await chocolateFactoryService.getFactoryByManagerId(managerId);
      if (existingFactory) {
        return res.status(400).json({ message: 'Manager is already assigned to another factory' });
      }

      const factory = await chocolateFactoryService.createChocolateFactory({ name, location, workingHours, logo, managerId });
      res.status(201).json(factory);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
];

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
