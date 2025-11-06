// backend/routes/index.js
const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');
const chocolateRoutes = require('./chocolateRoutes');
const purchaseRoutes = require('./purchaseRoutes');
const customerTypeRoutes = require('./customerTypeRoutes');
const locationRoutes = require('./locationRoutes');
const chocolateFactoryRoutes = require('./chocolateFactoryRoutes');
const cartRoutes = require('./cartRoutes');
const commentRoutes = require('./commentRoutes');

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/chocolates', chocolateRoutes);
router.use('/purchases', purchaseRoutes);
router.use('/customer-types', customerTypeRoutes);
router.use('/locations', locationRoutes);
router.use('/chocolate-factories', chocolateFactoryRoutes);
router.use('/carts', cartRoutes);
router.use('/comments', commentRoutes);

module.exports = router;
