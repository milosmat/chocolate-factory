const userDAO = require('../dao/userDAO');
const chocolateFactoryDAO = require('../dao/chocolateFactoryDAO');
const bcrypt = require('bcryptjs');

class UserService {
  async createUser(userData) {
    return await userDAO.createUser(userData);
  }

  async getUserById(userId) {
    return await userDAO.getUserById(userId);
  }

  async getUsers() {
    return await userDAO.getUsers();
  }

  async updateUser(userId, updateData) {
    return await userDAO.updateUser(userId, updateData);
  }

  async getAvailableManagers() {
    const managers = await userDAO.getUsersByRole('Manager');
    const factories = await chocolateFactoryDAO.getAllChocolateFactories();
    const assignedManagers = factories.map(factory => factory.managerId);
    return managers.filter(manager => !assignedManagers.includes(manager.id));
  }

  async deleteUser(userId) {
    return await userDAO.deleteUser(userId);
  }

  async authenticateUser(username, password) {
    const user = await userDAO.findUserByUsername(username);
    if (user && await user.comparePassword(password)) {
      return user;
    }
    return null;
  }

  async changePassword(userId, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userDAO.updateUser(userId, { password: hashedPassword });
  }
}

module.exports = new UserService();
