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
    
    <div v-if="factories.length === 0">
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
        <tr v-for="factory in sortedFactories" :key="factory.id">
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
      }
    };
  },
  computed: {
    sortedFactories() {
      let sortedFactories = [...this.factories];
      
      if (this.search.sortField) {
        sortedFactories.sort((a, b) => {
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
      
      return sortedFactories;
    }
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
        }));
        this.factories = factories;
      } catch (error) {
        console.error('Error loading factories:', error);
      }
    },
    async fetchChocolateAttributes() {
      try {
        const response = await axios.get('/api/chocolates');
        const chocolates = response.data;
        this.chocolateTypes = [...new Set(chocolates.map(choco => choco.variety))];
        this.chocolateKinds = [...new Set(chocolates.map(choco => choco.type))];
      } catch (error) {
        console.error('Error loading chocolate attributes:', error);
      }
    },
    async searchFactories() {
      try {
        const response = await axios.get('/api/factories/rest/search', {
          params: {
            name: this.search.name,
            chocolateName: this.search.chocolateName,
            location: this.search.location,
            rating: this.search.rating,
            sortField: this.search.sortField,
            sortOrder: this.search.sortOrder,
            chocolateType: this.search.chocolateType,
            chocolateKind: this.search.chocolateKind,
            openOnly: this.search.openOnly
          }
        });
        const factories = response.data;
        if (factories.length > 0) {
          await Promise.all(factories.map(async factory => {
            factory.locationAddress = await this.fetchLocationAddress(factory.location);
          }));
          this.factories = factories;
        }
      } catch (error) {
        console.error('Error searching factories:', error);
        this.factories = [];
      }
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
    async fetchLocationAddress(id) {
      try {
        const response = await fetch(`/api/locations/${id}`);
        const data = await response.json();
        return data.address;
      } catch (error) {
        console.error("Failed to fetch location:", error);
        return "Nepoznata lokacija";
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
