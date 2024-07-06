const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

class User {
  constructor({ id, username, password, firstName, lastName, gender, dateOfBirth, role, points, customerType, isBlocked }) {
    this.id = id || '';
    this.username = username || '';
    this.password = password || '';
    this.firstName = firstName || '';
    this.lastName = lastName || '';
    this.gender = gender || 'Other';
    this.dateOfBirth = dateOfBirth || '';
    this.role = role || 'Customer';
    this.points = points || 0;
    this.customerType = customerType || '';
    this.isBlocked = isBlocked || '';
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
      this.customerType,
      this.isBlocked
    ].join('|');
  }

  static fromCSV(values) {
    const fields = values.split('|');
    return new User({
      id: fields[0],
      username: fields[1],
      password: fields[2],
      firstName: fields[3],
      lastName: fields[4],
      gender: fields[5],
      dateOfBirth: fields[6],
      role: fields[7],
      points: parseInt(fields[8], 10),
      customerType: fields[9],
      isBlocked: fields[10]
    });
  }

  save() {
    const filePath = path.join(__dirname, "../data/users.csv");

    const users = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8').split('\n').filter(line => line.trim() !== '') : [];

    const updatedUsers = users.filter(line => {
      const fields = line.split('|');
      return fields[0] !== this.id;
    });

    updatedUsers.push(this.toCSV());

    fs.writeFileSync(filePath, updatedUsers.join('\n'), 'utf-8');
  }

  async comparePassword(password) {
    return await bcrypt.compare(password, this.password);
  }

  static async create(userData) {
    const user = new User(userData);
    user.password = await bcrypt.hash(user.password, 10); // Hashovanje lozinke pre čuvanja
    await user.save();
    return user;
  }
}

module.exports = User;
