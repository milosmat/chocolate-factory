<template>
    <div>
      <h1>Suspicious Users</h1>
      <ul>
        <li v-for="user in suspiciousUsers" :key="user.id">
          {{ user.username }} - {{ user.firstName }} {{ user.lastName }}
          <button @click="blockUser(user.id)">Block</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        suspiciousUsers: []
      };
    },
    created() {
      this.fetchSuspiciousUsers();
    },
    methods: {
      async fetchSuspiciousUsers() {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('No token found');
          }
          
          const response = await axios.get('/api/users/rest/suspicious-users', {
            headers: {
              'x-auth-token': token
            }
          });
  
          this.suspiciousUsers = response.data;
        } catch (error) {
          console.error('Error fetching suspicious users:', error);
        }
      },
      async blockUser(userId) {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.put(`/api/users/block-user/${userId}`, {}, {
            headers: {
              'x-auth-token': token,
              'Content-Type': 'application/json'
            }
          });
          alert(response.data.message);
          this.fetchSuspiciousUsers(); // Refresh the list after blocking a user
        } catch (error) {
          console.error('Error blocking user:', error);
        }
      }
    }
  };
  </script>
  
  <style>
  /* Dodaj stilove po potrebi */
  </style>
  