const userDAO = require('../dao/userDAO');

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
}

module.exports = new UserService();