const locationDAO = require('../dao/locationDAO');

class LocationService {
  async createLocation(locationData) {
    return await locationDAO.createLocation(locationData);
  }

  async getLocationById(locationId) {
    return await locationDAO.getLocationById(locationId);
  }

  async getLocations() {
    return await locationDAO.getAllLocations();
  }

  async updateLocation(locationId, updateData) {
    return await locationDAO.updateLocation(locationId, updateData);
  }

  async deleteLocation(locationId) {
    return await locationDAO.deleteLocation(locationId);
  }
}

module.exports = new LocationService();
