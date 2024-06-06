class Cart {
  constructor({ id, chocolates, user, totalPrice }) {
    this.id = id || '';
    this.chocolates = chocolates || [];
    this.user = user || '';
    this.totalPrice = totalPrice || 0;
  }

  toCSV() {
    return [
      this.id,
      this.chocolates.join(','), // Korišćenje join() za konverziju niza čokolada u string
      this.user,
      this.totalPrice
    ].join('|');
  }

  static fromCSV(values) {
    const fields = values.split('|');
    return new Cart({
      id: fields[0],
      chocolates: fields[1] ? fields[1].split(',') : [],
      user: fields[2],
      totalPrice: parseFloat(fields[3])
    });
  }
}

module.exports = Cart;
