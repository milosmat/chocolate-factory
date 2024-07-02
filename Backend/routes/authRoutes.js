const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

// Registracija
router.post('/register',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('gender').notEmpty().withMessage('Gender is required'),
    body('dateOfBirth').notEmpty().withMessage('Date of birth is required'),
    body('role').notEmpty().withMessage('Role is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, password, firstName, lastName, gender, dateOfBirth, role } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await userService.createUser({
        username,
        password: hashedPassword,
        firstName,
        lastName,
        gender,
        dateOfBirth,
        role
      });
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userService.authenticateUser(username, password);
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.json({ token, user });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/current-user', auth, async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
