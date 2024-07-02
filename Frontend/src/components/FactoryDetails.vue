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
      <div v-if="isManager">
        <button @click="goToAddChocolate(factory.id)">Dodaj čokoladu</button>
      </div>
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
            <th>Količina</th>
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
            <td>{{ chocolate.quantity }}</td>
            <td>
              <button v-if="isManager" @click="goToEditChocolate(chocolate.id)">Izmeni</button>
              <button v-if="isManager" @click="deleteChocolate(chocolate.id)">Obriši</button>
              <button v-if="isWorker" @click="editQuantity(chocolate.id)">Izmeni količinu</button>
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
      <div v-if="isManager">
        <h2>Dodaj radnika</h2>
        <button @click="goToAddWorker">Dodaj radnika</button>
      </div>
    </div>
    <div v-else>
      <p>Učitavanje...</p>
    </div>

    <!-- Modal za izmenu količine -->
    <div v-if="showQuantityForm">
      <h3>Izmeni količinu čokolade</h3>
      <form @submit.prevent="updateQuantity">
        <input v-model="newQuantity" type="number" placeholder="Nova količina" required />
        <button type="submit">Sačuvaj</button>
        <button type="button" @click="showQuantityForm = false">Otkaži</button>
      </form>
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
      comments: [],
      currentUser: null, // dodato za praćenje ulogovanog korisnika
      showQuantityForm: false,
      currentChocolateId: null,
      newQuantity: 0
    };
  },
  mounted() {
    this.fetchFactoryDetails();
    this.fetchCurrentUser();
  },
  computed: {
    isManager() {
      console.log('Checking if user is manager:', this.currentUser);
      return this.currentUser && this.currentUser.role === 'Manager';
    },
    isWorker() {
      console.log('Checking if user is worker:', this.currentUser);
      console.log('Factory:', this.factory);
      if (this.currentUser && this.currentUser.role === 'Worker' && this.factory && Array.isArray(this.factory.workerIds)) {
        console.log('Worker IDs:', this.factory.workerIds);
        console.log('Current User ID:', this.currentUser.id);
        return this.factory.workerIds.includes(this.currentUser.id.toString());
      }
      return false;
    }
  },
  methods: {
    async fetchFactoryDetails() {
      try {
        const factoryId = this.$route.params.id;
        const response = await axios.get(`/api/chocolate-factories/${factoryId}`);
        const factory = response.data;
        factory.locationAddress = await this.fetchLocationAddress(factory.location);
        factory.workerIds = factory.workerIds ? factory.workerIds.map(id => id.trim()) : [];
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
    async fetchCurrentUser() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/auth/current-user', {
          headers: {
            'x-auth-token': token
          }
        });
        this.currentUser = response.data;
        console.log('Fetched current user:', this.currentUser);
      } catch (error) {
        console.error('Error fetching current user:', error);
        this.currentUser = null;
      }
    },
    getFactoryImage(imagePath) {
      try {
        const imageName = imagePath.split('/').pop(); 
        return require('D:/web_projekat/chocolateFactory/Frontend/public/' + imageName);
      } catch (e) {
        console.error(`Image not found: ${imagePath}`);
        return '';
      }
    },
    getChocolateImage(imagePath) {
      try {
        const imageName = imagePath.split('/').pop(); 
        return require('D:/web_projekat/chocolateFactory/Frontend/public/' + imageName);
      } catch (e) {
        console.error(`Image not found: ${imagePath}`);
        return '';
      }
    },
    goToEditChocolate(chocolateId) {
      this.$router.push({ name: 'EditChocolate', params: { id: chocolateId } });
    },
    goToAddChocolate(factoryId) {
      this.$router.push({ name: 'AddChocolate', params: { factoryId } });
    },
    goToAddWorker() {
      const factoryId = this.factory.id; // Uzimamo ID fabrike
      this.$router.push({ name: 'CreateWorker', params: { factoryId } }); // Prosleđujemo ID fabrike
    },
    async deleteChocolate(chocolateId) {
      try {
        await axios.delete(`/api/chocolates/${chocolateId}`);
        this.chocolates = this.chocolates.filter(chocolate => chocolate.id !== chocolateId);
      } catch (error) {
        console.error('Error deleting chocolate:', error);
      }
    },
    editQuantity(chocolateId) {
      this.currentChocolateId = chocolateId;
      this.showQuantityForm = true;
    },
    async updateQuantity() {
      try {
        const response = await axios.put(`/api/chocolates/${this.currentChocolateId}/quantity`, {
          quantity: this.newQuantity
        });
        const updatedChocolate = response.data;
        const index = this.chocolates.findIndex(choco => choco.id === this.currentChocolateId);
        if (index !== -1) {
          this.chocolates[index] = updatedChocolate;
        }
        this.showQuantityForm = false;
        this.newQuantity = 0;
      } catch (error) {
        console.error('Error updating quantity:', error);
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
