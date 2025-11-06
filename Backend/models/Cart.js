class Cart {
  constructor({ id, chocolates, user, totalPrice, isOrdered, itemQuantity }) {
    this.id = id || '';
    this.chocolates = chocolates || [];
    this.user = user || '';
    this.totalPrice = totalPrice || 0;
    this.isOrdered = isOrdered || '';
    this.itemQuantity = itemQuantity || [];
  }

  toCSV() {
    return [
      this.id,
      this.chocolates.join(','),
      this.user,
      this.totalPrice,
      this.isOrdered,
      this.itemQuantity.join(',')
    ].join('|');
  }

  static fromCSV(values) {
    const fields = values.split('|');
    return new Cart({
      id: fields[0],
      chocolates: fields[1] ? fields[1].split(',') : [],
      user: fields[2],
      totalPrice: parseFloat(fields[3]),
      isOrdered: fields[4],
      itemQuantity: fields[5] ? fields[5].split(',') : []
    });
  }
}

module.exports = Cart;
