class Chocolate {
  constructor({ id, name, price, type, factoryId, variety, weight, description, image, status, quantity }) {
      this.id = id || null;
      this.name = name || '';
      this.price = parseFloat(price) || 0;
      this.type = type || '';
      this.factoryId = factoryId || '';
      this.variety = variety || '';
      this.weight = parseFloat(weight) || 0;
      this.description = description || '';
      this.image = image || '';
      this.status = status || '';
      this.quantity = parseInt(quantity, 10) || 0;
  }

  toCSV() {
      return [
          this.id,
          this.name,
          this.price,
          this.type,
          this.factoryId,
          this.variety,
          this.weight,
          this.description,
          this.image,
          this.status,
          this.quantity
      ].join('|');
  }

  static fromCSV(values) {
      const fields = values.split('|');
      return new Chocolate({
          id: fields[0],
          name: fields[1],
          price: parseFloat(fields[2]),
          type: fields[3],
          factoryId: fields[4],
          variety: fields[5],
          weight: parseFloat(fields[6]),
          description: fields[7],
          image: fields[8],
          status: fields[9],
          quantity: parseInt(fields[10], 10)
      });
  }
}

module.exports = Chocolate;
