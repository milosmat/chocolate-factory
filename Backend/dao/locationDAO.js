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
    const { street, city, postalCode, latitude, longitude } = locationData;
    if (!street || !city || !postalCode || latitude === undefined || longitude === undefined) {
      throw new Error('Incomplete location data');
    }
    const address = `${street}, ${city}, ${postalCode}`;
    const location = new Location({ longitude, latitude, address });
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
      const updatedLocationData = {
        ...this.locations[locationIndex],
        ...updateData,
        address: `${updateData.street || this.locations[locationIndex].street}, ${updateData.city || this.locations[locationIndex].city}, ${updateData.postalCode || this.locations[locationIndex].postalCode}`
      };
      this.locations[locationIndex] = new Location(updatedLocationData);
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
    this.serializer.toCSV(this.filePath, this.locations);
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
