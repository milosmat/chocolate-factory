<template>
  <div class="factory-list">
    <h1>Lista fabrika čokolade</h1>
    <table>
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
            <button @click="goToAddChocolate(factory.id)">Dodaj čokoladu</button>
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
      factories: [] // Prazan niz fabrika
    };
  },
  computed: {
    sortedFactories() {
      return [...this.factories].sort((a, b) => {
        if (a.status === 'Open' && b.status !== 'Open') return -1;
        if (a.status !== 'Open' && b.status === 'Open') return 1;
        return 0;
      });
    }
  },
  mounted() {
    this.fetchFactories();
  },
  methods: {
    async fetchFactories() {
      try {
        const response = await axios.get('/api/chocolate-factories');
        const factories = response.data;
        await Promise.all(factories.map(async factory => {
          factory.locationAddress = await this.fetchLocationAddress(factory.location);
        }));
        this.factories = factories;
      } catch (error) {
        console.error('Error loading factories:', error);
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
        return data.address; // Pretpostavimo da API vraća objekat sa poljem address
      } catch (error) {
        console.error("Failed to fetch location:", error);
        return "Nepoznata lokacija";
      }
    },
    goToFactoryDetails(factoryId) {
      this.$router.push({ name: 'FactoryDetails', params: { id: factoryId } });
    },
    goToAddChocolate(factoryId) {
      this.$router.push({ name: 'AddChocolate', params: { factoryId } });
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
