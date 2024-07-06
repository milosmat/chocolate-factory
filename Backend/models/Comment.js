class Comment {
  constructor({ id, customer, factory, text, rating, status }) {
    this.id = id || '';
    this.customer = customer || '';
    this.factory = factory || '';
    this.text = text || '';
    this.rating = parseFloat(rating) || 0;
    this.status = status || '';
  }

  toCSV() {
    return [
      this.id,
      this.customer,
      this.factory,
      this.text,
      this.rating,
      this.status
    ].join('|');
  }

  static fromCSV(values) {
    const fields = values.split('|');
    return new Comment({
      id: fields[0],
      customer: fields[1],
      factory: fields[2],
      text: fields[3],
      rating: parseFloat(fields[4]),
      status: fields[5]
    });
  }
}

module.exports = Comment;
