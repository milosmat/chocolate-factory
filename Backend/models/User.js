const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

class User {
  constructor({ id, username, password, firstName, lastName, gender, dateOfBirth, role, purchases, cart, chocolateFactory, points, customerType }) {
    this.id = id || '';
    this.username = username || '';
    this.password = password || '';
    this.firstName = firstName || '';
    this.lastName = lastName || '';
    this.gender = gender || 'Other';
    this.dateOfBirth = dateOfBirth || '';
    this.role = role || 'Customer';
    this.purchases = purchases || [];
    this.cart = cart || '';
    this.chocolateFactory = chocolateFactory || '';
    this.points = points || 0;
    this.customerType = customerType || '';
  }

  toCSV() {
    return [
      this.id,
      this.username,
      this.password,
      this.firstName,
      this.lastName,
      this.gender,
      this.dateOfBirth,
      this.role,
      this.points,
      this.customerType
    ];
  }

  static fromCSV(values) {
    return new User({
      id: values[0],
      username: values[1],
      password: values[2],
      firstName: values[3],
      lastName: values[4],
      gender: values[5],
      dateOfBirth: values[6],
      role: values[7],
      points: parseInt(values[8], 10),
      customerType: values[9]
    });
  }

  async save() {
    if (this.isPasswordModified || !this.passwordHashed) {
      this.password = await bcrypt.hash(this.password, 10);
      this.passwordHashed = true;
    }

    const filePath = path.join(__dirname, "../data/users.csv");

    const users = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8').split('\n').filter(line => line.trim() !== '') : [];

    const updatedUsers = users.filter(line => {
      const fields = line.split('|');
      return fields[0] !== this.id;
    });

    updatedUsers.push(this.toCSV().join('|'));

    fs.writeFileSync(filePath, updatedUsers.join('\n'), 'utf-8');
  }

  async comparePassword(password) {
    return await bcrypt.compare(password, this.password);
  }

  static async create(userData) {
    const user = new User(userData);
    await user.save();
    return user;
  }
}

module.exports = User;
