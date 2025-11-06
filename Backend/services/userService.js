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

  async updateCustomerType(userId) {
    const user = await userDAO.getUserById(userId);
    console.log('Updating user:', user); // Dodato za debug
    if (user) {
      // Provera trenutnog broja poena i ažuriranje tipa kupca
      let newCustomerTypeId = null;
      if (user.points > 80) {
        newCustomerTypeId = 2; // ID za VIP
      } else if (user.points > 50) {
        newCustomerTypeId = 1; // ID za Regular
      }else{
        newCustomerTypeId = 0;
      }
      
      // Ažuriraj user objekt
      user.customerType = newCustomerTypeId;
      console.log('Updating user:', user); // Dodato za debug
      await userDAO.updateUser(userId, user);
      return user;
    }
    throw new Error('User not found');
  }
  async getSuspiciousUsers() {
    return await userDAO.getSuspiciousUsers();
  }

  async blockUser(userId) {
    return await userDAO.blockUser(userId);
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
