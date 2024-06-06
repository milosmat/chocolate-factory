class Purchase {
  constructor({ id, purchaseId, chocolates, factory, dateTime, totalPrice, customer, status }) {
    this.id = id || '';
    this.purchaseId = purchaseId || '';
    this.chocolates = chocolates || [];
    this.factory = factory || '';
    this.dateTime = new Date(dateTime) || new Date();
    this.totalPrice = parseFloat(totalPrice) || 0;
    this.customer = customer || '';
    this.status = status || '';
  }

  toCSV() {
    return [
      this.id,
      this.purchaseId,
      this.chocolates.join(','),
      this.factory,
      this.dateTime.toISOString(),
      this.totalPrice,
      this.customer,
      this.status
    ].join('|');
  }

  static fromCSV(values) {
    const fields = values.split('|');
    return new Purchase({
      id: fields[0],
      purchaseId: fields[1],
      chocolates: fields[2] ? fields[2].split(',') : [],
      factory: fields[3],
      dateTime: new Date(fields[4]),
      totalPrice: parseFloat(fields[5]),
      customer: fields[6],
      status: fields[7]
    });
  }
}

module.exports = Purchase;
