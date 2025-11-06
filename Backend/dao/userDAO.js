const path = require("path");
const fs = require('fs');
const Serializer = require("../serializer/serializer");
const User = require("../models/User");

class UserDAO {
  constructor() {
    this.filePath = path.join(__dirname, "../data/users.csv");
    this.serializer = new Serializer();
    this.users = this.loadFromCSV();
  }

  async createUser(userData) {
    const user = new User(userData);
    user.id = this.getNextId();
    await user.save();
    this.users.push(user);
    this.saveToCSV();
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
      this.saveToCSV();
      return this.users[userIndex];
    }
    return null;
  }

  async deleteUser(userId) {
    const userIndex = this.users.findIndex((user) => user.id === userId);
    if (userIndex !== -1) {
      this.users.splice(userIndex, 1);
      this.saveToCSV();
      return true;
    }
    return false;
  }

  findUserByUsername(username) {
    return this.users.find((user) => user.username === username);
  }

  saveToCSV() {
    this.serializer.toCSV(this.filePath, this.users.map(user => user.toCSV()));
  }

  loadFromCSV() {
    if (fs.existsSync(this.filePath)) {
      return this.serializer.fromCSV(this.filePath, User);
    } else {
      console.log("CSV file not found.");
      return [];
    }
  }

  getNextId() {
    const maxId = this.users.reduce((max, user) => {
      return Math.max(max, parseInt(user.id, 10));
    }, 0);
    return (maxId + 1).toString();
  }
}

module.exports = new UserDAO();
