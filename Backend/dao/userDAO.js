const path = require("path");
const Serializer = require("../serializer/serializer");
const User = require("../models/User");
const fs = require('fs');

class UserDAO {
  constructor() {
    this.filePath = path.join(__dirname, "../data/users.csv");
    this.serializer = new Serializer();
    this.users = this.serializer.fromCSV(this.filePath, User);
  }

  getAll() {
    this.users = this.serializer.fromCSV(this.filePath, User);
    return this.users.filter((user) => !user.isDeleted);
  }

  async createUser(userData) {
    const user = new User(userData);
    user.id = this.nextId();
    await user.save();
    this.users.push(user);
    this.serializer.toCSV(this.filePath, this.users);
    return user;
  }

  async getUserById(userId) {
    return this.users.find((user) => user.id === userId);
  }

  async getUsers() {
    return this.users;
  }

  async updateUser(userId, updateData) {
    const userIndex = this.users.findIndex((user) => user.id === userId);
    if (userIndex !== -1) {
      const updatedUser = new User({ ...this.users[userIndex], ...updateData });
      await updatedUser.save();
      this.users[userIndex] = updatedUser;
      this.serializer.toCSV(this.filePath, this.users);
      return this.users[userIndex];
    }
    return null;
  }

  async deleteUser(userId) {
    const userIndex = this.users.findIndex((user) => user.id === userId);
    if (userIndex !== -1) {
      this.users[userIndex].isDeleted = true;
      this.serializer.toCSV(this.filePath, this.users);
      return true;
    }
    return false;
  }

  async getUsersByRole(role) {
    const users = this.loadFromCSV();
    return users.filter(user => user.role === role);
  }

  findUserByUsername(username) {
    return this.users.find((user) => user.username === username && !user.isDeleted);
  }

  nextId() {
    this.users = this.serializer.fromCSV(this.filePath, User);
    if (this.users.length < 1) {
      return 1;
    }
    return Math.max(...this.users.map((u) => parseInt(u.id, 10))) + 1;
  }

  loadFromCSV() {
    if (fs.existsSync(this.filePath)) {
      return this.serializer.fromCSV(this.filePath, User);
    } else {
      console.log("CSV file not found.");
      return [];
    }
  }
}

module.exports = new UserDAO();
