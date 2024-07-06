const path = require("path");
const Serializer = require("../serializer/serializer");
const User = require("../models/User");
const fs = require('fs');
const PurchaseDAO = require('./purchaseDAO');
const moment = require('moment');

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

  async getSuspiciousUsers() {
    const purchases = await PurchaseDAO.getAllPurchases();
    const oneMonthAgo = moment().subtract(1, 'months').toDate();
    const suspiciousUsers = {};
    console.log('All purchases:', purchases); // Dodato za debug
    purchases.forEach(purchase => {
      if (purchase.status === 'Otkazano' && new Date(purchase.dateTime) > oneMonthAgo) {
        if (!suspiciousUsers[purchase.customer]) {
          suspiciousUsers[purchase.customer] = 0;
          console.log("++");
        }
        suspiciousUsers[purchase.customer]++;
        console.log('Suspicious users:', suspiciousUsers[purchase.customer]); // Dodato za debug
      }
    });
    console.log('Suspicious users:', suspiciousUsers); // Dodato za debug

    const result = Object.keys(suspiciousUsers).filter(userId => suspiciousUsers[userId] > 5);
    console.log('Suspicious user IDs:', result);
    const users = this.users;
    return users.filter(user => result.includes(user.id));
  }

  async blockUser(userId) {
    const user = this.users.find(user => user.id === userId);
    console.log('Blocking user:', user); // Dodato za debug
    if (user) {
      user.isBlocked = true;
      this.serializer.toCSV(this.filePath, this.users);
      return user;
    }
    return null;
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
