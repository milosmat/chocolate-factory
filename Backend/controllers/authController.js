// backend/controllers/authController.js
const userService = require('../services/userService');

exports.registerUser = async (req, res) => {
  const { username, password, confirmPassword, firstName, lastName, gender, dateOfBirth, role } = req.body;
  
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  if (role && role !== 'Customer') {
    return res.status(400).json({ message: 'Cannot set role directly. Default role is Customer.' });
  }

  try {
    const user = await userService.createUser({
      username,
      password,
      firstName,
      lastName,
      gender,
      dateOfBirth,
      role: 'Customer'
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await userService.authenticateUser(username, password);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
