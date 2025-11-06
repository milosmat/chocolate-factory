const path = require("path");
const fs = require('fs');
const Serializer = require("../serializer/serializer");
const Location = require("../models/Location");

class LocationDAO {
  constructor() {
    this.filePath = path.join(__dirname, "../data/location.csv");
    this.serializer = new Serializer();
    this.locations = this.loadFromCSV();
  }

  async createLocation(locationData) {
    const location = new Location(locationData);
    location.id = this.getNextId();
    this.locations.push(location);
    this.saveToCSV();
    return location;
  }

  async getAllLocations() {
    return this.locations;
  }

  async getLocationById(locationId) {
    return this.locations.find(location => location.id === locationId);
  }

  async updateLocation(locationId, updateData) {
    const locationIndex = this.locations.findIndex(location => location.id === locationId);
    if (locationIndex !== -1) {
      this.locations[locationIndex] = { ...this.locations[locationIndex], ...updateData };
      this.saveToCSV();
      return this.locations[locationIndex];
    }
    return null;
  }

  async deleteLocation(locationId) {
    const locationIndex = this.locations.findIndex(location => location.id === locationId);
    if (locationIndex !== -1) {
      this.locations.splice(locationIndex, 1);
      this.saveToCSV();
      return true;
    }
    return false;
  }

  saveToCSV() {
    this.serializer.toCSV(this.filePath, this.locations.map(location => location.toCSV()));
  }

  loadFromCSV() {
    if (fs.existsSync(this.filePath)) {
      return this.serializer.fromCSV(this.filePath, Location);
    } else {
      console.log("CSV file not found.");
      return [];
    }
  }

  getNextId() {
    const maxId = this.locations.reduce((max, location) => {
      return Math.max(max, parseInt(location.id, 10));
    }, 0);
    return (maxId + 1).toString();
  }
}

module.exports = new LocationDAO();
