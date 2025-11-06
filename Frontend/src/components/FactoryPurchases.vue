<template>
    <div>
      <h1>Kupovine fabrike</h1>
      <div v-if="purchases.length">
        <table>
          <thead>
            <tr>
              <th>ID Kupovine</th>
              <th>Čokolade</th>
              <th>Ukupna cena</th>
              <th>Datum</th>
              <th>Status</th>
              <th>Kupac</th>
              <th>Akcija</th> <!-- Novo: Kolona za akcije -->
            </tr>
          </thead>
          <tbody>
            <tr v-for="purchase in purchases" :key="purchase.id">
              <td>{{ purchase.purchaseId }}</td>
              <td>{{ getChocolateNames(purchase.chocolates).join(', ') }}</td>
              <td>{{ purchase.totalPrice }} RSD</td>
              <td>{{ new Date(purchase.dateTime).toLocaleString() }}</td>
              <td>{{ purchase.status }}</td>
              <td>{{ purchase.customer }}</td>
              <td>
                <!-- Prikaz akcija samo ako je status 'Obrada' -->
                <div v-if="purchase.status === 'Obrada'">
                  <select v-model="purchase.newStatus" @change="handleStatusChange(purchase)">
                    <option disabled value="">Promeni status</option>
                    <option value="Odobreno">Odobreno</option>
                    <option value="Odbijeno">Odbijeno</option>
                  </select>
                  <div v-if="purchase.newStatus === 'Odbijeno'">
                    <input 
                      type="text" 
                      v-model="purchase.managerMessage" 
                      placeholder="Unesite razlog odbijanja"
                    />
                  </div>
                  <button @click="updatePurchaseStatus(purchase)">Ažuriraj</button>
                </div>
                <!-- Prikaz poruke da je status već ažuriran -->
                <div v-else>
                  <span>Nema dostupnih akcija za trenutni status</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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
        chocolates: []
      };
    },
    mounted() {
      this.fetchPurchases();
      this.fetchChocolates();
    },
    methods: {
      async fetchPurchases() {
        try {
          const { factoryId, managerId } = this.$route.params;
          const response = await axios.get(`/api/purchases/factory/${factoryId}/manager/${managerId}/purchases`);
          // Inicijalizuj newStatus i managerMessage za svaku kupovinu
          this.purchases = response.data.map(purchase => ({
            ...purchase,
            newStatus: '', // Dodato polje za praćenje promene statusa
            managerMessage: '' // Dodato polje za unos poruke menadžera
          }));
        } catch (error) {
          console.error('Error loading purchases:', error);
        }
      },
      async fetchChocolates() {
        try {
          const response = await axios.get('/api/chocolates');
          this.chocolates = response.data;
        } catch (error) {
          console.error('Error loading chocolates:', error);
        }
      },
      getChocolateNames(ids) {
        return ids.map(id => {
          const chocolate = this.chocolates.find(choco => choco.id === id);
          return chocolate ? chocolate.name : 'Unknown';
        });
      },
      async updatePurchaseStatus(purchase) {
        try {
          const { factoryId, managerId } = this.$route.params;
          const payload = {
            status: purchase.newStatus,
            managerMessage: purchase.managerMessage
          };
  
          await axios.put(
            `/api/purchases/factory/${factoryId}/manager/${managerId}/purchases/${purchase.id}/status`,
            payload
          );
  
          // Osvježi listu kupovina nakon ažuriranja statusa
          this.fetchPurchases();
        } catch (error) {
          console.error('Error updating purchase status:', error);
        }
      },
      handleStatusChange(purchase) {
        // Resetuj poruku menadžera ako nije Odbijeno
        if (purchase.newStatus !== 'Odbijeno') {
          purchase.managerMessage = '';
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Local styles for the component */
  table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #ccc;
  }
  th, td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: left;
  }
  select {
    margin-bottom: 10px;
  }
  input[type="text"] {
    margin-bottom: 10px;
    margin-right: 5px;
  }
  button {
    padding: 5px 10px;
  }
  </style>
  