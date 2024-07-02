const chocolateFactoryService = require('../services/chocolateFactoryService');
const userService = require('../services/userService'); // Dodajte ovaj import
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');

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

exports.searchChocolateFactories = async (req, res) => {
  try {
    console.log("searchChocolateFactories method called");
    const { name, chocolateName, location, rating, sortField, sortOrder, chocolateType, chocolateKind, openOnly } = req.query;
    console.log("Query Params: ", { name, chocolateName, location, rating, sortField, sortOrder, chocolateType, chocolateKind, openOnly }); // Dodato za proveru query parametara
    
    const factories = await chocolateFactoryService.searchChocolateFactories(name, chocolateName, location, rating, sortField, sortOrder, chocolateType, chocolateKind, openOnly);
    console.log("Factories Found: ", factories); // Dodato za proveru pronađenih fabrika
    
    if (!factories || factories.length === 0) {
      console.log("No factories found");
      return res.status(404).json({ message: 'Chocolate factory not found' });
    }
    
    res.json(factories);
  } catch (error) {
    console.log("Error: ", error); // Dodato za proveru grešaka
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

exports.addWorkerToFactory = async (req, res) => {
  const factoryId = req.params.id;
  const { workerId } = req.body;
  const userId = req.user.id; // Trenutno ulogovani korisnik (menadžer)

  try {
    const updatedFactory = await chocolateFactoryService.addWorkerToFactory(factoryId, workerId, userId);
    console.log('abcd');
    res.json({ message: 'Worker added to factory'});
  } catch (error) {
    console.log('sgdndsfjnvsjnd');
    res.status(500).json({ message: error.message });
  }
};