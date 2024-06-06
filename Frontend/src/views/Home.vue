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
        </tr>
      </thead>
      <tbody>
        <tr v-for="factory in sortedFactories" :key="factory.id">
          <td>{{ factory.name }}</td>
          <td><img :src="getFactoryImage(factory.logo)" alt="Factory Image" /></td>
          <td>{{ factory.locationAddress || 'Učitavanje...' }}</td>
          <td>{{ factory.rating }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
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
        const response = await fetch('/api/chocolate-factories');
        const factories = await response.json();
        await Promise.all(factories.map(async factory => {
          factory.locationAddress = await this.fetchLocationAddress(factory.location);
        }));
        this.factories = factories; // Ažuriraj lokalno stanje sa kompletnim informacijama
      } catch (error) {
        console.error('Error loading factories:', error);
      }
    },
    getFactoryImage(imagePath) {
      try {
        const imageName = imagePath.split('/').pop(); 
        return require('/web_projekat/Frontend/public/' + imageName);
      } catch (e) {
        console.error(`Image not found: ${imagePath}`);
        return ''; // Vrati prazan string ako slika nije nađena
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
