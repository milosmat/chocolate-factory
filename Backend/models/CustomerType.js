class CustomerType {
  constructor({ id, name, discount, requiredPoints }) {
    this.id = id || '';
    this.name = name || '';
    this.discount = parseFloat(discount) || 0;
    this.requiredPoints = parseInt(requiredPoints, 10) || 0;
  }

  toCSV() {
    return [
      this.id,
      this.name,
      this.discount,
      this.requiredPoints
    ].join('|');
  }

  static fromCSV(values) {
    const fields = values.split('|');
    return new CustomerType({
      id: fields[0],
      name: fields[1],
      discount: parseFloat(fields[2]),
      requiredPoints: parseInt(fields[3], 10)
    });
  }
}

module.exports = CustomerType;
