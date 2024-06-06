class Location {
  constructor({ id, longitude, latitude, address }) {
    this.id = id || '';
    this.longitude = longitude || 0;
    this.latitude = latitude || 0;
    this.address = address || '';
  }

  toCSV() {
    return [
      this.id,
      this.longitude,
      this.latitude,
      this.address
    ].join('|');
  }

  static fromCSV(values) {
    const fields = values.split('|');
    return new Location({
      id: fields[0],
      longitude: parseFloat(fields[1]),
      latitude: parseFloat(fields[2]),
      address: fields[3]
    });
  }
}

module.exports = Location;
