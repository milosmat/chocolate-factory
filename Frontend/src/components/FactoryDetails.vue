<template>
  <div>
    <h1>Detalji fabrike</h1>
    <div v-if="factory">
      <p><strong>Naziv:</strong> {{ factory.name }}</p>
      <p><strong>Radno vreme:</strong> {{ factory.workingHours }}</p>
      <p><strong>Status:</strong> {{ factory.status }}</p>
      <p><strong>Lokacija:</strong> {{ factory.locationAddress }}</p>
      <p><strong>Ocena:</strong> {{ factory.rating }}</p>
      <img :src="getFactoryImage(factory.logo)" alt="Factory Image" />
      <h2>Čokolade</h2>
      <table>
        <thead>
          <tr>
            <th>Naziv</th>
            <th>Cena</th>
            <th>Vrsta</th>
            <th>Tip</th>
            <th>Gramaža</th>
            <th>Opis</th>
            <th>Slika</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="chocolate in chocolates" :key="chocolate.id">
            <td>{{ chocolate.name }}</td>
            <td>{{ chocolate.price }} RSD</td>
            <td>{{ chocolate.type }}</td>
            <td>{{ chocolate.variety }}</td>
            <td>{{ chocolate.weight }}g</td>
            <td>{{ chocolate.description }}</td>
            <td><img :src="getChocolateImage(chocolate.image)" alt="Chocolate Image" height="100px"/></td>
            <td>
              <button @click="goToEditChocolate(chocolate.id)">Izmeni</button>
              <button @click="deleteChocolate(chocolate.id)">Obriši</button>
            </td>
          </tr>
        </tbody>
      </table>
      <h2>Komentari</h2>
      <ul>
        <li v-for="comment in comments" :key="comment.id">
          <strong>{{ comment.customer }}</strong>: {{ comment.text }} ({{ comment.rating }}/5)
        </li>
      </ul>
    </div>
    <div v-else>
      <p>Učitavanje...</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      factory: null,
      chocolates: [],
      comments: []
    };
  },
  mounted() {
    this.fetchFactoryDetails();
  },
  methods: {
    async fetchFactoryDetails() {
      try {
        const factoryId = this.$route.params.id;
        const response = await axios.get(`/api/chocolate-factories/${factoryId}`);
        const factory = response.data;
        factory.locationAddress = await this.fetchLocationAddress(factory.location);
        this.factory = factory;
        this.chocolates = await this.fetchChocolates(factoryId);
        this.comments = await this.fetchComments(factoryId);
      } catch (error) {
        console.error('Error loading factory details:', error);
      }
    },
    async fetchLocationAddress(id) {
      try {
        const response = await axios.get(`/api/locations/${id}`);
        return response.data.address;
      } catch (error) {
        console.error("Failed to fetch location:", error);
        return "Nepoznata lokacija";
      }
    },
    async fetchChocolates(factoryId) {
      try {
        const response = await axios.get(`/api/chocolates?factoryId=${factoryId}`);
        return response.data;
      } catch (error) {
        console.error('Error loading chocolates:', error);
        return [];
      }
    },
    async fetchComments(factoryId) {
      try {
        const response = await axios.get(`/api/comments?factory=${factoryId}`);
        return response.data;
      } catch (error) {
        console.error('Error loading comments:', error);
        return [];
      }
    },
    getFactoryImage(imagePath) {
      try {
        const imageName = imagePath.split('/').pop(); 
        return require('/web_projekat/Frontend/public/' + imageName);
      } catch (e) {
        console.error(`Image not found: ${imagePath}`);
        return '';
      }
    },
    getChocolateImage(imagePath) {
      try {
        const imageName = imagePath.split('/').pop(); 
        return require('/web_projekat/Frontend/public/' + imageName);
      } catch (e) {
        console.error(`Image not found: ${imagePath}`);
        return '';
      }
    },
    goToEditChocolate(chocolateId) {
      this.$router.push({ name: 'EditChocolate', params: { id: chocolateId } });
    },
    async deleteChocolate(chocolateId) {
      try {
        await axios.delete(`/api/chocolates/${chocolateId}`);
        this.chocolates = this.chocolates.filter(chocolate => chocolate.id !== chocolateId);
      } catch (error) {
        console.error('Error deleting chocolate:', error);
      }
    }
  }
}
</script>

<style scoped>
/* Local styles for the component */
.factory-details img {
  width: 50px; /* Smanjena širina slike */
  height: 50px;
}
table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ccc; /* Dodan border na tabelu */
}
th, td {
  border: 1px solid #ccc; /* Dodan border na ćelije tabele */
  padding: 8px;
  text-align: left;
}
</style>
