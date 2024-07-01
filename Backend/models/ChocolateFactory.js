class ChocolateFactory {
  constructor({ id, name, workingHours, status, location, logo, rating, managerId }) {
    this.id = id || '';
    this.name = name || '';
    this.workingHours = workingHours || '';
    this.status = status || '';
    this.location = location || '';
    this.logo = logo || '';
    this.rating = rating || '';
    this.managerId = managerId || '';
  }

  toCSV() {
    return [
      this.id,
      this.name,
      this.workingHours,
      this.status,
      this.location,
      this.logo,
      this.rating,
      this.managerId
    ].join('|');
  }

  static fromCSV(values) {
    const fields = values.split('|');
    return new ChocolateFactory({
      id: fields[0],
      name: fields[1],
      workingHours: fields[2],
      status: fields[3],
      location: fields[4],
      logo: fields[5],
      rating: fields[6],
      managerId: fields[7]
    });
  }
}

module.exports = ChocolateFactory;
