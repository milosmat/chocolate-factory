// backend/loadData.js
const mongoose = require('mongoose');
const userDao = require('./dao/userDAO');
const chocolateDao = require('./dao/chocolateDAO');
const purchaseDao = require('./dao/purchaseDAO');
const customerTypeDao = require('./dao/customerTypeDAO');
const locationDao = require('./dao/locationDAO');
const chocolateFactoryDao = require('./dao/chocolateFactoryDAO');
const cartDao = require('./dao/cartDAO');
const commentDao = require('./dao/commentDAO');

const loadData = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/my-webapp', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    await userDao.loadUsersFromCSV('./data/user.csv');
    await chocolateDao.loadChocolatesFromCSV('./data/chocolate.csv');
    await purchaseDao.loadPurchasesFromCSV('./data/purchase.csv');
    await customerTypeDao.loadCustomerTypesFromCSV('./data/customerType.csv');
    await locationDao.loadLocationsFromCSV('./data/location.csv');
    await chocolateFactoryDao.loadChocolateFactoriesFromCSV('./data/chocolateFactory.csv');
    await cartDao.loadCartsFromCSV('./data/cart.csv');
    await commentDao.loadCommentsFromCSV('./data/comment.csv');

    console.log('Data loaded successfully');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error loading data:', error);
  }
};

loadData();
