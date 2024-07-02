const chocolateFactoryDAO = require('../dao/chocolateFactoryDAO');
const chocolateDAO = require('../dao/chocolateDAO');

class ChocolateFactoryService {
  async createChocolateFactory(factoryData) {
    return await chocolateFactoryDAO.createChocolateFactory(factoryData);
  }

  async getChocolateFactoryById(factoryId) {
    return await chocolateFactoryDAO.getChocolateFactoryById(factoryId);
  }

  async getChocolateFactories() {
    return await chocolateFactoryDAO.getAllChocolateFactories();
  }

  async updateChocolateFactory(factoryId, updateData) {
    return await chocolateFactoryDAO.updateChocolateFactory(factoryId, updateData);
  }

  async deleteChocolateFactory(factoryId) {
    return await chocolateFactoryDAO.deleteChocolateFactory(factoryId);
  }

  async searchChocolateFactories(name, chocolateName, location, rating, sortField, sortOrder, chocolateType, chocolateKind, openOnly) {
    const allFactories = await chocolateFactoryDAO.getAllChocolateFactories();
    console.log("All Factories: ", allFactories); // Dodato za proveru svih fabrika
    let factoriesToReturn = allFactories;
  
    if (chocolateName || chocolateType || chocolateKind) {
      const chocolates = await chocolateDAO.getAllChocolates();
      console.log("All Chocolates: ", chocolates); // Dodato za proveru svih čokolada
      const factoryIds = chocolates
        .filter(choco => {
          const nameMatch = !chocolateName || choco.name.toLowerCase().includes(chocolateName.toLowerCase());
          const typeMatch = !chocolateType || choco.variety === chocolateType;
          const kindMatch = !chocolateKind || choco.type === chocolateKind;
          return nameMatch && typeMatch && kindMatch;
        })
        .map(choco => choco.factoryId);
      factoriesToReturn = factoriesToReturn.filter(factory => factoryIds.includes(factory.id));
    }
  
    openOnly = (openOnly === 'true' || openOnly === true);

    console.log("OpenOnly: ", openOnly);
    factoriesToReturn = factoriesToReturn.filter(factory => {
      const nameMatch = !name || factory.name.toLowerCase().includes(name.toLowerCase());
      const locationMatch = !location || factory.location.toLowerCase().includes(location.toLowerCase());
      const ratingMatch = !rating || factory.rating >= parseFloat(rating);
      let openMatch = true;
      if (openOnly) {
        openMatch = factory.status.toLowerCase() === 'open';
      }
      console.log(`Factory: ${factory.name}, Name Match: ${nameMatch}, Location Match: ${locationMatch}, Rating Match: ${ratingMatch}, Open Match: ${openMatch}`); // Dodato za proveru uslova
      return nameMatch && locationMatch && ratingMatch && openMatch;
    });
  
    if (sortField) {
      factoriesToReturn.sort((a, b) => {
        let fieldA = a[sortField];
        let fieldB = b[sortField];
  
        if (typeof fieldA === 'string') fieldA = fieldA.toLowerCase();
        if (typeof fieldB === 'string') fieldB = fieldB.toLowerCase();
  
        if (sortOrder === 'desc') {
          return fieldA < fieldB ? 1 : -1;
        } else {
          return fieldA > fieldB ? 1 : -1;
        }
      });
    }
  
    console.log("Factories after sorting: ", factoriesToReturn);
    return factoriesToReturn;
  }
  async addWorkerToFactory(factoryId, workerId, managerId) {
    const factory = await chocolateFactoryDAO.getChocolateFactoryById(factoryId);
  
    if (!factory) {
      throw new Error('Factory not found');
    }
  
    if (factory.managerId !== managerId) {
      throw new Error('Only the assigned manager can add workers to this factory');
    }
  
    if (!factory.workerIds) {
      factory.workerIds = [];
    }
  
    factory.workerIds.push(workerId);
    const updatedFactory = await chocolateFactoryDAO.updateChocolateFactory(factoryId, factory);
  
    // Dodavanje provere da li updatedFactory ima metodu toCSV
    if (typeof updatedFactory.toCSV !== 'function') {
      console.error('Updated factory does not have a toCSV method:', updatedFactory);
      throw new Error('Updated factory is not an instance of ChocolateFactory');
    }
    return factory;
  }
  
  
}

module.exports = new ChocolateFactoryService();
