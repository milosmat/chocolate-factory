<template>
  <div class="factory-list">
    <h1>Lista fabrika čokolade</h1>
    <form @submit.prevent="searchFactories">
      <input v-model="search.name" placeholder="Naziv fabrike" />
      <input v-model="search.chocolateName" placeholder="Naziv čokolade" />
      <input v-model="search.location" placeholder="Lokacija" />
      <input v-model="search.rating" type="number" step="0.1" placeholder="Prosečna ocena" />
      <select v-model="search.sortField">
        <option value="">Sortiraj po</option>
        <option value="name">Naziv fabrike</option>
        <option value="location">Lokacija</option>
        <option value="rating">Prosečna ocena</option>
      </select>
      <select v-model="search.sortOrder">
        <option value="asc">Rastuće</option>
        <option value="desc">Opadajuće</option>
      </select>
      <select v-model="search.chocolateType">
        <option value="">Vrsta čokolade</option>
        <option v-for="type in chocolateTypes" :key="type" :value="type">{{ type }}</option>
      </select>
      <select v-model="search.chocolateKind">
        <option value="">Tip čokolade</option>
        <option v-for="kind in chocolateKinds" :key="kind" :value="kind">{{ kind }}</option>
      </select>
      <label>
        <input type="checkbox" v-model="search.openOnly" />
        Prikaz samo otvorenih fabrika
      </label>
      <button type="submit">Pretraži</button>
    </form>
    
    <div v-if="filteredAndSortedFactories.length === 0">
      <p>Nema pronađenih fabrika.</p>
    </div>
    
    <table v-else>
      <thead>
        <tr>
          <th>Naziv</th>
          <th>Logo</th>
          <th>Lokacija</th>
          <th>Prosečna ocena</th>
          <th>Akcije</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="factory in filteredAndSortedFactories" :key="factory.id">
          <td>{{ factory.name }}</td>
          <td><img :src="getFactoryImage(factory.logo)" alt="Factory Image" /></td>
          <td>{{ factory.locationAddress || 'Učitavanje...' }}</td>
          <td>{{ factory.rating }}</td>
          <td>
            <button @click="goToFactoryDetails(factory.id)">Detalji</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      factories: [],
      chocolates: [],
      chocolateTypes: [],
      chocolateKinds: [],
      search: {
        name: '',
        chocolateName: '',
        location: '',
        rating: '',
        sortField: '',
        sortOrder: 'asc',
        chocolateType: '',
        chocolateKind: '',
        openOnly: false
      },
      filteredAndSortedFactories: [],
      isSearchExecuted: false
    };
  },
  mounted() {
    this.fetchFactories();
    this.fetchChocolateAttributes();
  },
  methods: {
    async fetchFactories() {
      try {
        const response = await axios.get('/api/factories');
        const factories = response.data;

        await Promise.all(factories.map(async factory => {
          factory.locationAddress = await this.fetchLocationAddress(factory.location);
          await this.updateFactoryStatus(factory); // Ažuriraj status fabrike
          factory.city = this.extractCityFromAddress(factory.locationAddress);
        }));

        this.factories = factories;
        this.filteredAndSortedFactories = factories;
      } catch (error) {
        console.error('Error loading factories:', error);
      }
    },

    extractCityFromAddress(address) {
      const parts = address.split(',').map(part => part.trim());
      return parts.length > 1 ? parts[1] : '';
    },

    async fetchLocationAddress(id) {
      try {
        const response = await axios.get(`/api/locations/${id}`);
        const data = response.data;
        return data.address;
      } catch (error) {
        console.error("Failed to fetch location:", error);
        return "Nepoznata lokacija";
      }
    },

    async updateFactoryStatus(factory) {
      if (!factory.workingHours) {
        console.warn(`Factory ${factory.name} does not have working hours defined.`);
        console.log('factory rating: ', factory.rating);
        factory.status = 'Closed';
        await this.updateFactoryInCSV(factory);
        return;
      }

      const workingHours = factory.workingHours.split('-');
      if (workingHours.length !== 2) {
        console.warn(`Factory ${factory.name} has invalid working hours format.`);
        factory.status = 'Closed';
        await this.updateFactoryInCSV(factory);
        return;
      }

      const openTime = this.parseTime(workingHours[0]);
      const closeTime = this.parseTime(workingHours[1]);
      const currentTime = new Date();

      if ((currentTime >= openTime && currentTime <= closeTime) || 
          (closeTime < openTime && (currentTime >= openTime || currentTime <= closeTime))) {
        factory.status = 'Open';
      } else {
        factory.status = 'Closed';
      }

      await this.updateFactoryInCSV(factory);
    },

    parseTime(timeString) {
      const [hours, minutes] = timeString.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      return date;
    },

    async updateFactoryInCSV(factory) {
      try {
        await axios.put(`/api/factories/${factory.id}`, {
          status: factory.status
        });
        console.log(`Factory ${factory.name} status updated to ${factory.status}`);
      } catch (error) {
        console.error(`Error updating factory ${factory.name} status:`, error);
      }
    },

    async fetchChocolateAttributes() {
      try {
        const response = await axios.get('/api/chocolates');
        const chocolates = response.data;
        this.chocolates = chocolates;
        this.chocolateTypes = [...new Set(chocolates.map(choco => choco.variety))];
        this.chocolateKinds = [...new Set(chocolates.map(choco => choco.type))];
      } catch (error) {
        console.error('Error loading chocolate attributes:', error);
      }
    },

    searchFactories() {
      this.isSearchExecuted = true;
      this.filteredAndSortedFactories = this.getFilteredAndSortedFactories();
    },

    getFilteredAndSortedFactories() {
      let filteredFactories = this.factories.filter(factory => {
        const matchesName = this.search.name ? factory.name.toLowerCase().includes(this.search.name.toLowerCase()) : true;
        const matchesChocolateName = this.search.chocolateName ? this.chocolates.some(choco => choco.factoryId === factory.id && choco.name.toLowerCase().includes(this.search.chocolateName.toLowerCase())) : true;
        const matchesLocation = this.search.location ? factory.city && factory.city.toLowerCase() === this.search.location.toLowerCase() : true;
        const matchesRating = this.search.rating ? factory.rating >= parseFloat(this.search.rating) : true;
        const matchesChocolateType = this.search.chocolateType ? this.chocolates.some(choco => choco.factoryId === factory.id && choco.variety === this.search.chocolateType) : true;
        const matchesChocolateKind = this.search.chocolateKind ? this.chocolates.some(choco => choco.factoryId === factory.id && choco.type === this.search.chocolateKind) : true;
        const matchesOpenOnly = this.search.openOnly ? factory.status === 'Open' : true;
        return matchesName && matchesChocolateName && matchesLocation && matchesRating && matchesChocolateType && matchesChocolateKind && matchesOpenOnly;
      });

      // Sortiraj fabrike tako da su otvorene na vrhu
      filteredFactories.sort((a, b) => {
        if (a.status === 'Open' && b.status !== 'Open') return -1;
        if (a.status !== 'Open' && b.status === 'Open') return 1;
        return 0;
      });

      // Dodatno sortiranje po odabranom polju
      if (this.search.sortField) {
        filteredFactories.sort((a, b) => {
          let fieldA = a[this.search.sortField];
          let fieldB = b[this.search.sortField];

          if (typeof fieldA === 'string') fieldA = fieldA.toLowerCase();
          if (typeof fieldB === 'string') fieldB = fieldB.toLowerCase();

          if (this.search.sortOrder === 'asc') {
            return fieldA > fieldB ? 1 : -1;
          } else {
            return fieldA < fieldB ? 1 : -1;
          }
        });
      }

      return filteredFactories;
    },

    getFactoryImage(imagePath) {
      if (!imagePath) return '';
      if (imagePath.startsWith('uploads\\')) {
        return `http://localhost:3000/${imagePath}`;
      } else {
        try {
          const imageName = imagePath.split('/').pop(); 
          return require('D:/web_projekat/chocolateFactory/Frontend/public/' + imageName);
        } catch (e) {
          console.error(`Image not found: ${imagePath}`);
          return '';
        }
      }
    },

    goToFactoryDetails(factoryId) {
      this.$router.push({ name: 'FactoryDetails', params: { id: factoryId } });
    }
  }
}
</script>

<style scoped>
.factory-list img {
  width: 100px;
  height: auto;
}
.factory-list table {
  width: 100%;
  border-collapse: collapse;
}
.factory-list th, .factory-list td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}
</style>
