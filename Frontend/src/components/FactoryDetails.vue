<template>
  <div>
    <h1>Detalji fabrike</h1>
    <div v-if="factory">
      <p><strong>Naziv:</strong> {{ factory.name }}</p>
      <p><strong>Radno vreme:</strong> {{ factory.workingHours }}</p>
      <p><strong>Status:</strong> {{ factory.status }}</p>
      <p><strong>Lokacija:</strong> {{ factory.locationAddress }}</p>
      <div id="map" class="map"></div>
      <p><strong>Ocena:</strong> {{ factory.rating }}</p>
      <img :src="getFactoryImage(factory.logo)" alt="Factory Image" />
      <h2>Čokolade</h2>
      <div v-if="isManager">
        <div v-if="isManagerOfFactory">
          <button @click="goToPurchases(factory.id)">Pregledaj kupovine</button>
        </div>
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
          <tr v-for="chocolate in filteredChocolates" :key="chocolate.id">
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
              <button v-if="isCustomer" @click="openQuantityForm(chocolate.id)">Dodaj u korpu</button>
            </td>
          </tr>
        </tbody>
      </table>
      <h2>Komentari</h2>
      <ul>
        <li v-for="comment in approvedComments" :key="comment.id">
          <strong>{{ comment.customer }}</strong>: {{ comment.text }} ({{ comment.rating }}/5)
        </li>
      </ul>
      
      <div v-if="isManager || isAdmin">
        <h2>Komentari na čekanju</h2>
        <ul>
          <li v-for="comment in pendingComments" :key="comment.id">
            <strong>{{ comment.customer }}</strong>: {{ comment.text }} ({{ comment.rating }}/5) status: {{ comment.status }}
            <button v-if="isManager" @click="updateCommentStatus(comment, 'Odobreno')">Odobri</button>
            <button v-if="isManager" @click="updateCommentStatus(comment, 'Odbijeno')">Odbij</button>
          </li>
        </ul>
      </div>
      
      
      <!-- Forma za dodavanje komentara -->
      <div v-if="canLeaveComment">
        <h2>Ostavite komentar i ocenu</h2>
        <form @submit.prevent="submitComment">
          <textarea v-model="newCommentText" placeholder="Unesite vaš komentar" required></textarea>
          <label for="rating">Ocena:</label>
          <select v-model="newCommentRating" required>
            <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
          </select>
          <button type="submit">Pošalji</button>
        </form>
      </div>

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
      <div class="modal-overlay" @click="closeQuantityForm"></div>
      <div class="modal-content">
        <h3>Izaberite količinu</h3>
        <form @submit.prevent="confirmAddToCart">
          <input v-model.number="selectedQuantities[currentChocolateId]" type="number" :max="currentChocolateQuantity" min="1" required />
          <button type="submit">Dodaj</button>
          <button type="button" @click="closeQuantityForm">Otkaži</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import 'ol/ol.css';
import { Map, View } from 'ol';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM } from 'ol/source';
import { Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { Vector as VectorSource } from 'ol/source';
import { Feature } from 'ol';
import { Style, Icon } from 'ol/style';

export default {
  data() {
    return {
      factory: null,
      chocolates: [],
      comments: [],
      currentUser: null,
      showQuantityForm: false,
      currentChocolateId: null,
      currentChocolateQuantity: 0,
      newQuantity: 0,
      selectedQuantities: {}, // Dodato za praćenje količina čokolada
      newCommentText: '',
      newCommentRating: null,
      approvedPurchases: [],
      map: null
    };
  },
  mounted() {
    this.fetchFactoryDetails();
    this.fetchCurrentUser();
  },
  computed: {
    isManager() {
      return this.currentUser && this.currentUser.role === 'Manager';
    },
    isAdmin(){
      return this.currentUser && this.currentUser.role === 'Administrator';
    },
    isWorker() {
      return this.currentUser && this.currentUser.role === 'Worker' && this.factory && this.factory.workerIds.includes(this.currentUser.id.toString());
    },
    isCustomer() {
      return this.currentUser && this.currentUser.role === 'Customer';
    },
    isManagerOfFactory() {
      return this.currentUser && this.currentUser.role === 'Manager' && this.factory && this.factory.managerId === this.currentUser.id;
    },
    filteredChocolates() {
      if (this.isCustomer) {
        return this.chocolates.filter(chocolate => chocolate.quantity > 0);
      }
      return this.chocolates;
    },
    canLeaveComment() {
      return this.isCustomer && this.approvedPurchases.length > 0;
    },
    approvedComments() {
    return this.comments.filter(comment => comment.status === 'Odobreno');
    },
    pendingComments() {
      return this.comments.filter(comment => comment.status !== 'Odobreno');
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
        await this.fetchCurrentUser();
        this.chocolates = await this.fetchChocolates(factoryId);
        this.comments = await this.fetchComments(factoryId);
        this.$nextTick(() => {
          this.initMap(factory.location); // Initialize map with factory location
        });
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
        let chocolates = response.data;
        if (this.currentUser && this.currentUser.role === 'Customer') {
          chocolates = chocolates.filter(chocolate => chocolate.quantity > 0);
        }
        return chocolates;
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
        await this.fetchApprovedPurchases();
      } catch (error) {
        console.error('Error fetching current user:', error);
        this.currentUser = null;
      }
    },
    async updateCommentStatus(comment, status) {
      try {
        await axios.put(`/api/comments/${comment.id}/status`, { status });
        comment.status = status;
        this.fetchComments(this.factory.id); // Ponovo učitava komentare nakon ažuriranja
      } catch (error) {
        console.error('Error updating comment status:', error);
      }
    },
    async fetchApprovedPurchases() {
      try {
        const response = await axios.get(`/api/purchases/user/${this.currentUser.id}`);
        this.approvedPurchases = response.data.filter(purchase => 
          purchase.status === 'Odobreno' && purchase.factory === this.factory.id
        );
      } catch (error) {
        console.error('Error fetching approved purchases:', error);
        this.approvedPurchases = [];
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
      const factoryId = this.factory.id;
      this.$router.push({ name: 'CreateWorker', params: { factoryId } });
    },
    goToPurchases(factoryId) {
      const managerId = this.currentUser.id;
      this.$router.push({ name: 'FactoryPurchases', params: { factoryId, managerId } });
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
    },
    openQuantityForm(chocolateId) {
      this.currentChocolateId = chocolateId;
      const chocolate = this.chocolates.find(choco => choco.id === chocolateId);
      this.currentChocolateQuantity = chocolate ? chocolate.quantity : 0;
      this.showQuantityForm = true;
    },
    closeQuantityForm() {
      this.showQuantityForm = false;
      this.currentChocolateId = null;
      this.currentChocolateQuantity = 0;
    },
    async confirmAddToCart() {
      const chocolateId = this.currentChocolateId;
      const quantity = this.selectedQuantities[chocolateId];
      if (!quantity || quantity <= 0) {
        alert("Unesite validnu količinu.");
        return;
      }

      const chocolate = this.chocolates.find(choco => choco.id === chocolateId);
      if (quantity > chocolate.quantity) {
        alert("Nema dovoljno čokolade na stanju.");
        return;
      }

      try {
        await axios.post(`/api/carts/user/${this.currentUser.id}`, {
          chocolateId,
          quantity
        });

        alert('Čokolada je dodata u korpu.');
        this.closeQuantityForm();
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    },
    async submitComment() {
      try {
        const response = await axios.post('/api/comments', {
          customer: this.currentUser.id,
          factory: this.factory.id,
          text: this.newCommentText,
          rating: this.newCommentRating,
          status: 'Obrada'
        });
        this.comments.push(response.data);
        this.newCommentText = '';
        this.newCommentRating = null;
        alert('Komentar je uspešno dodat.');
      } catch (error) {
        console.error('Error submitting comment:', error);
      }
    },
    async initMap(locationId) {
      try {
        const response = await axios.get(`/api/locations/${locationId}`);
        const location = response.data;
        console.log('Location:', location);
        
        const transformedCoordinates = fromLonLat([location.latitude, location.longitude]);
        console.log('Transformed coordinates:', transformedCoordinates);

        const map = new Map({
          target: 'map',
          layers: [
            new TileLayer({
              source: new OSM(),
            }),
          ],
          view: new View({
            center: transformedCoordinates,
            zoom: 15,
          }),
        });

        const vectorSource = new VectorSource({
          features: [
            new Feature({
              geometry: new Point(transformedCoordinates),
            }),
          ],
        });

        const vectorLayer = new VectorLayer({
          source: vectorSource,
          style: new Style({
            image: new Icon({
              src: '/locationMarker.png', // Ensure the path is correct
              anchor: [0.5, 1],
            }),
          }),
        });

        map.addLayer(vectorLayer);
        this.map = map;
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    },
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
.map {
  width: 100%;
  height: 400px;
  margin-bottom: 20px;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}
.modal-content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  z-index: 1001;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
