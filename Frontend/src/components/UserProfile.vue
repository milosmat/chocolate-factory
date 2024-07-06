<template>
    <div>
      <h1>Moj Profil</h1>
      <div v-if="user">
        <p><strong>Korisničko ime:</strong> {{ user.username }}</p>
        <p><strong>Ime:</strong> <input v-model="user.firstName" /></p>
        <p><strong>Prezime:</strong> <input v-model="user.lastName" /></p>
        <p><strong>Pol:</strong>
          <select v-model="user.gender">
            <option value="Male">Muški</option>
            <option value="Female">Ženski</option>
            <option value="Other">Drugo</option>
          </select>
        </p>
        <p><strong>Datum rođenja:</strong> <input type="date" v-model="user.dateOfBirth" /></p>
        <p v-if="user.role === 'Customer'"><strong>Poeni:</strong> {{ user.points }}</p>
        <p v-if="user.role === 'Customer'"><strong>Tip kupca:</strong> <input v-model="user.customerType" /></p>
        <button @click="updateProfile">Ažuriraj profil</button>
        <h2>Promena šifre</h2>
        <p><strong>Nova šifra:</strong> <input type="password" v-model="newPassword" /></p>
        <p><strong>Potvrda nove šifre:</strong> <input type="password" v-model="confirmPassword" /></p>
        <button @click="changePassword">Promeni šifru</button>
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
        user: null,
        newPassword: '',       // Dodato
        confirmPassword: ''    // Dodato
      };
    },
    async created() {
      await this.fetchUserProfile();
    },
    methods: {
      async fetchUserProfile() {
        try {
          const token = localStorage.getItem('token');
          const userId = this.$route.params.userId;
          const response = await axios.get(`/api/users/${userId}`, {
            headers: {
              'x-auth-token': token
            }
          });
          this.user = response.data;
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      },
      async updateProfile() {
        try {
          const userId = this.$route.params.userId;
          await axios.put(`/api/users/${userId}`, this.user);
          alert('Profil uspešno ažuriran.');
        } catch (error) {
          console.error('Error updating profile:', error);
        }
      },
      async changePassword() {
        if (this.newPassword !== this.confirmPassword) {
          alert('Šifre se ne poklapaju.');
          return;
        }
        try {
          const token = localStorage.getItem('token');
          const userId = this.$route.params.userId;
          await axios.put(`/api/users/${userId}/change-password`, {
            password: this.newPassword
          }, {
            headers: {
              'x-auth-token': token
            }
          });
          alert('Šifra uspešno promenjena.');
          this.newPassword = '';
          this.confirmPassword = '';
        } catch (error) {
          console.error('Error changing password:', error);
        }
      }
    }
  }
  </script>
  
  <style scoped>
  /* Local styles for the component */
  input, select {
    margin-left: 10px;
    padding: 5px;
    font-size: 14px;
  }
  button {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
  }
  button:hover {
    background-color: #45a049;
  }
  </style>
  