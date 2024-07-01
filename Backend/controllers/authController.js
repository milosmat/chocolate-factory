const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');

exports.registerUser = async (req, res) => {
  // Validacija podataka
  await body('username').notEmpty().withMessage('Username is required').run(req);
  await body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long').run(req);
  await body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }).run(req);
  await body('firstName').notEmpty().withMessage('First name is required').run(req);
  await body('lastName').notEmpty().withMessage('Last name is required').run(req);
  await body('gender').notEmpty().withMessage('Gender is required').run(req);
  await body('dateOfBirth').notEmpty().withMessage('Date of birth is required').run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password, firstName, lastName, gender, dateOfBirth, role } = req.body;


  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userService.createUser({
      username,
      password: hashedPassword,
      firstName,
      lastName,
      gender,
      dateOfBirth,
      role: 'Customer'
    });
    res.status(201).json(user);
  } catch (error) {
    console.log('Error creating user:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
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
      res.status(200).json({ token, user });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.log('Error logging in:', error);
    res.status(400).json({ message: error.message });
  }
};
