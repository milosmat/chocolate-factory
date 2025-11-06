const locationService = require('../services/locationService');

exports.createLocation = async (req, res) => {
  try {
    const location = await locationService.createLocation(req.body);
    res.status(201).json(location);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getLocationById = async (req, res) => {
  try {
    const location = await locationService.getLocationById(req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.json(location);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getLocations = async (req, res) => {
  try {
    const locations = await locationService.getLocations();
    res.json(locations);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const location = await locationService.updateLocation(req.params.id, req.body);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.json(location);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteLocation = async (req, res) => {
  try {
    const location = await locationService.deleteLocation(req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.json({ message: 'Location deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
