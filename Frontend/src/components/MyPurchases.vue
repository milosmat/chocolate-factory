<template>
  <div class="my-purchases">
    <h1>Moje Kupovine</h1>

    <!-- Filters -->
    <div class="filters">
      <label for="factoryName">Naziv fabrike:</label>
      <input v-model="filters.factoryName" id="factoryName" placeholder="Naziv fabrike">

      <label for="minPrice">Minimalna cena:</label>
      <input type="number" v-model="filters.minPrice" id="minPrice" placeholder="Min">

      <label for="maxPrice">Maksimalna cena:</label>
      <input type="number" v-model="filters.maxPrice" id="maxPrice" placeholder="Max">

      <label for="startDate">Datum od:</label>
      <input type="date" v-model="filters.startDate" id="startDate">

      <label for="endDate">Datum do:</label>
      <input type="date" v-model="filters.endDate" id="endDate">

      <button @click="applyFilters">Primeni filtere</button>
    </div>

    <!-- Sorting -->
    <div class="sorting">
      <label for="sortField">Sortiraj po:</label>
      <select v-model="sortField" id="sortField">
        <option value="factoryName">Naziv fabrike</option>
        <option value="price">Cena</option>
        <option value="date">Datum</option>
      </select>
      <button @click="sortOrderAsc = !sortOrderAsc">
        Sortiraj {{ sortOrderAsc ? 'rastuće' : 'opadajuće' }}
      </button>
    </div>

    <!-- Purchases Table -->
    <div v-if="sortedFilteredPurchases.length > 0">
      <table>
        <thead>
          <tr>
            <th>Naziv fabrike</th>
            <th>Nazivi kupljenih cokolada</th>
            <th>Cena kupovine</th>
            <th>Datum</th>
            <th>Status</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(purchase, index) in sortedFilteredPurchases" :key="index">
            <td>{{ getFactoryName(purchase.factory) }}</td>
            <td>{{ getChocolateNames(purchase.chocolates).join(', ') }}</td>
            <td>{{ purchase.totalPrice }}</td>
            <td>{{ new Date(purchase.dateTime).toLocaleDateString() }}</td>
            <td>{{ purchase.status }} {{purchase.managerMessage}}</td>
            <td>
              <button v-if="purchase.status === 'Obrada'" @click="cancelOrder(purchase.id)">Otkaži</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p>Ukupna cena: {{ totalPrice }} RSD</p>
    </div>
    <div v-else>
      <p>Nema kupovina za prikaz.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      purchases: [],
      chocolates: [],
      factories: [],
      filters: {
        factoryName: '',
        minPrice: '',
        maxPrice: '',
        startDate: '',
        endDate: ''
      },
      sortField: 'date',
      sortOrderAsc: true,
      appliedFilters: {
        factoryName: '',
        minPrice: '',
        maxPrice: '',
        startDate: '',
        endDate: ''
      }
    };
  },
  async created() {
    await this.fetchUserPurchases();
    await this.fetchChocolates();
    await this.fetchFactories();
  },
  computed: {
    filteredPurchases() {
      return this.purchases.filter(purchase => {
        const factoryName = this.getFactoryName(purchase.factory);
        const purchaseDate = new Date(purchase.dateTime);

        const matchesFactory = !this.appliedFilters.factoryName || factoryName.includes(this.appliedFilters.factoryName);
        const matchesPrice = (!this.appliedFilters.minPrice || purchase.totalPrice >= this.appliedFilters.minPrice) &&
                             (!this.appliedFilters.maxPrice || purchase.totalPrice <= this.appliedFilters.maxPrice);
        const matchesDate = (!this.appliedFilters.startDate || purchaseDate >= new Date(this.appliedFilters.startDate)) &&
                            (!this.appliedFilters.endDate || purchaseDate <= new Date(this.appliedFilters.endDate));

        return matchesFactory && matchesPrice && matchesDate;
      });
    },
    sortedFilteredPurchases() {
      return [...this.filteredPurchases].sort((a, b) => {
        if (this.sortField === 'factoryName') {
          const nameA = this.getFactoryName(a.factory).toLowerCase();
          const nameB = this.getFactoryName(b.factory).toLowerCase();
          if (nameA < nameB) return this.sortOrderAsc ? -1 : 1;
          if (nameA > nameB) return this.sortOrderAsc ? 1 : -1;
          return 0;
        } else if (this.sortField === 'price') {
          return this.sortOrderAsc ? a.totalPrice - b.totalPrice : b.totalPrice - a.totalPrice;
        } else if (this.sortField === 'date') {
          return this.sortOrderAsc ? new Date(a.dateTime) - new Date(b.dateTime) : new Date(b.dateTime) - new Date(a.dateTime);
        }
        return 0;
      });
    },
    totalPrice() {
      return this.purchases.reduce((sum, purchase) => sum + purchase.totalPrice, 0);
    }
  },
  methods: {
    async fetchUserPurchases() {
      try {
        const userId = this.$route.params.userId;
        const response = await axios.get(`/api/purchases/user/${userId}`);
        this.purchases = response.data;
      } catch (error) {
        console.error('Error fetching user purchases:', error);
      }
    },
    async fetchChocolates() {
      try {
        const response = await axios.get('/api/chocolates');
        this.chocolates = response.data;
      } catch (error) {
        console.error('Error fetching chocolates:', error);
      }
    },
    async fetchFactories() {
      try {
        const response = await axios.get('/api/factories');
        this.factories = response.data;
      } catch (error) {
        console.error('Error fetching factories:', error);
      }
    },
    getChocolateName(id) {
      const chocolate = this.chocolates.find(choco => choco.id === id);
      return chocolate ? chocolate.name : 'Unknown';
    },
    getChocolateNames(ids) {
      return ids.map(id => this.getChocolateName(id));
    },
    getChocolatePrice(id) {
      const chocolate = this.chocolates.find(choco => choco.id === id);
      return chocolate ? chocolate.price : 'Unknown';
    },
    getChocolatePrices(ids) {
      return ids.map(id => this.getChocolatePrice(id));
    },
    getFactoryName(id) {
      const factory = this.factories.find(factory => factory.id === id);
      return factory ? factory.name : 'Unknown';
    },
    applyFilters() {
      this.appliedFilters = { ...this.filters };
    },
    async cancelOrder(purchaseId) {
      try {
        const token = localStorage.getItem('token');
        await axios.put(`/api/purchases/user/${this.$route.params.userId}/purchase/${purchaseId}/cancel-order`, {}, {
          headers: {
            'x-auth-token': token
          }
        });
        alert('Porudžbina je otkazana.');
        await this.fetchUserPurchases(); // Refresh the list of purchases after cancellation
      } catch (error) {
        console.error('Error cancelling order:', error);
      }
    }
  }
}
</script>

<style scoped>
.my-purchases {
  margin: 20px;
}
.my-purchases table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
.my-purchases th, .my-purchases td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}
.filters {
  margin-bottom: 20px;
}
.filters label, .filters input {
  margin-right: 10px;
}
.sorting {
  margin-bottom: 20px;
}
</style>
