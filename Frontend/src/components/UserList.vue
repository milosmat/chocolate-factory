<template>
    <div>
      <h1>Lista korisnika</h1>
  
      <!-- Pretraga -->
      <div class="filters">
        <label for="searchFirstName">Pretraga po imenu:</label>
        <input type="text" v-model="searchFirstName" placeholder="Pretraži po imenu" @input="applyFilters" />
        
        <label for="searchLastName">Pretraga po prezimenu:</label>
        <input type="text" v-model="searchLastName" placeholder="Pretraži po prezimenu" @input="applyFilters" />
        
        <label for="searchUsername">Pretraga po korisničkom imenu:</label>
        <input type="text" v-model="searchUsername" placeholder="Pretraži po korisničkom imenu" @input="applyFilters" />
        
        <!-- Filtriranje -->
        <label for="roleFilter">Filtriraj po ulozi:</label>
        <select v-model="roleFilter" @change="applyFilters">
          <option value="">Sve uloge</option>
          <option value="Administrator">Administrator</option>
          <option value="Manager">Manager</option>
          <option value="Customer">Customer</option>
        </select>
        
        <label for="customerTypeFilter" v-if="roleFilter === 'Customer'">Tip kupca:</label>
        <select v-if="roleFilter === 'Customer'" v-model="customerTypeFilter" @change="applyFilters">
          <option value="">Svi tipovi</option>
          <option value="Regular">Regular</option>
          <option value="VIP">VIP</option>
        </select>
      </div>
  
      <!-- Sortiranje -->
      <div class="sorting">
        <label for="sortField">Sortiraj po:</label>
        <select v-model="sortField" @change="applyFilters">
          <option value="username">Korisničko ime</option>
          <option value="firstName">Ime</option>
          <option value="lastName">Prezime</option>
          <option value="points">Poeni</option>
        </select>
        <button @click="sortOrderAsc = !sortOrderAsc">
          Sortiraj {{ sortOrderAsc ? 'rastuće' : 'opadajuće' }}
        </button>
      </div>
  
      <div v-if="filteredUsers.length">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Korisničko ime</th>
              <th>Ime</th>
              <th>Prezime</th>
              <th>Uloga</th>
              <th>Poeni</th>
              <th>Akcije</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.username }}</td>
              <td>{{ user.firstName }}</td>
              <td>{{ user.lastName }}</td>
              <td>{{ user.role }}</td>
              <td v-if="user.role === 'Customer'">{{ user.points }}</td>
              <td v-else>-</td>
              <td>
                <button @click="viewUser(user.id)">Pregledaj</button>
                <button @click="editUser(user.id)">Izmeni</button>
                <button @click="deleteUser(user.id)">Obriši</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else>
        <p>Nema korisnika za prikaz.</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        users: [],
        searchFirstName: '',
        searchLastName: '',
        searchUsername: '',
        roleFilter: '',
        customerTypeFilter: '',
        sortField: 'username',
        sortOrderAsc: true
      };
    },
    computed: {
      filteredUsers() {
        let filtered = this.users;
  
        if (this.searchFirstName) {
          const firstName = this.searchFirstName.toLowerCase();
          filtered = filtered.filter(user =>
            user.firstName.toLowerCase().includes(firstName)
          );
        }
  
        if (this.searchLastName) {
          const lastName = this.searchLastName.toLowerCase();
          filtered = filtered.filter(user =>
            user.lastName.toLowerCase().includes(lastName)
          );
        }
  
        if (this.searchUsername) {
          const username = this.searchUsername.toLowerCase();
          filtered = filtered.filter(user =>
            user.username.toLowerCase().includes(username)
          );
        }
  
        if (this.roleFilter) {
          filtered = filtered.filter(user => user.role === this.roleFilter);
        }
  
        if (this.roleFilter === 'Customer' && this.customerTypeFilter) {
          filtered = filtered.filter(user => user.customerType === this.customerTypeFilter);
        }
  
        return filtered.sort((a, b) => {
          let fieldA = a[this.sortField];
          let fieldB = b[this.sortField];
  
          if (this.sortField === 'points') {
            fieldA = parseInt(fieldA) || 0;
            fieldB = parseInt(fieldB) || 0;
          }
  
          if (fieldA < fieldB) return this.sortOrderAsc ? -1 : 1;
          if (fieldA > fieldB) return this.sortOrderAsc ? 1 : -1;
          return 0;
        });
      }
    },
    async created() {
      await this.fetchUsers();
    },
    methods: {
      async fetchUsers() {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get('/api/users', {
            headers: {
              'x-auth-token': token
            }
          });
          this.users = response.data;
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      },
      viewUser(userId) {
        this.$router.push({ name: 'UserProfile', params: { userId } });
      },
      editUser(userId) {
        this.$router.push({ name: 'EditUser', params: { userId } });
      },
      async deleteUser(userId) {
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`/api/users/${userId}`, {
            headers: {
              'x-auth-token': token
            }
          });
          alert('Korisnik uspešno obrisan.');
          this.fetchUsers(); // Ponovo učitava listu korisnika nakon brisanja
        } catch (error) {
          console.error('Error deleting user:', error);
        }
      },
      applyFilters() {
        // This will trigger the computed property to re-evaluate
        this.filteredUsers;
      }
    }
  };
  </script>
  
  <style scoped>
  /* Local styles for the component */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  th, td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: left;
  }
  button {
    margin-right: 10px;
  }
  .filters, .sorting {
    margin-bottom: 20px;
  }
  </style>
  