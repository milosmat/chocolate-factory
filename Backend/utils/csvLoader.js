// backend/utils/csvLoader.js
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const loadCSV = (filePath, model, fromCSVMethod) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        const instance = new model();
        instance[fromCSVMethod](Object.values(data));
        results.push(instance);
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

module.exports = loadCSV;
