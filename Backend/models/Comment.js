class Comment {
  constructor({ id, customer, factory, text, rating }) {
    this.id = id || '';
    this.customer = customer || '';
    this.factory = factory || '';
    this.text = text || '';
    this.rating = parseFloat(rating) || 0;
  }

  toCSV() {
    return [
      this.id,
      this.customer,
      this.factory,
      this.text,
      this.rating
    ].join('|');
  }

  static fromCSV(values) {
    const fields = values.split('|');
    return new Comment({
      id: fields[0],
      customer: fields[1],
      factory: fields[2],
      text: fields[3],
      rating: parseFloat(fields[4])
    });
  }
}

module.exports = Comment;
