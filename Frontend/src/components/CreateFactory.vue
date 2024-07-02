<template>
    <div>
      <h1>Create Chocolate Factory</h1>
      <form @submit.prevent="createFactory">
        <input v-model="name" placeholder="Factory Name" required />
        <input v-model="location" placeholder="Location" required />
        <input v-model="workingHours" placeholder="Working Hours" required />
        <input type="file" @change="onFileChange" required />
        <select v-model="selectedManagerId" required>
          <option v-for="manager in availableManagers" :key="manager.id" :value="manager.id">
            {{ manager.username }}
          </option>
        </select>
        <button v-if="!selectedManagerId" type="button" @click="showManagerForm = true">Create New Manager</button>
        <div v-if="showManagerForm">
          <h2>Create New Manager</h2>
          <input v-model="newManager.username" placeholder="Username" required />
          <input v-model="newManager.password" type="password" placeholder="Password" required />
          <input v-model="newManager.confirmPassword" type="password" placeholder="Confirm Password" required />
          <input v-model="newManager.firstName" placeholder="First Name" required />
          <input v-model="newManager.lastName" placeholder="Last Name" required />
          <input v-model="newManager.gender" placeholder="Gender" required />
          <input v-model="newManager.dateOfBirth" type="date" placeholder="Date of Birth" required />
        </div>
        <button type="submit">Create Factory</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        name: '',
        location: '',
        workingHours: '',
        logo: null,
        rating: 0.0,
        availableManagers: [],
        selectedManagerId: null,
        showManagerForm: false,
        newManager: {
          username: '',
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: '',
          gender: '',
          dateOfBirth: ''
        }
      };
    },
    mounted() {
      this.fetchAvailableManagers();
    },
    methods: {
      async fetchAvailableManagers() {
        try {
          const response = await axios.get('http://localhost:3000/api/chocolate-factories/managers/available');
          this.availableManagers = response.data;
        } catch (error) {
          console.error('Error fetching available managers:', error);
        }
      },
      onFileChange(event) {
        this.logo = event.target.files[0];
      },
      async createFactory() {
        const formData = new FormData();
        formData.append('name', this.name);
        formData.append('location', this.location);
        formData.append('workingHours', this.workingHours);
        formData.append('logo', this.logo);
        formData.append('managerId', this.selectedManagerId);
  
        if (!this.selectedManagerId) {
          if (this.newManager.password !== this.newManager.confirmPassword) {
            console.error('Passwords do not match!');
            return;
          }
  
          try {
            const managerResponse = await axios.post('http://localhost:3000/api/auth/register', {
              ...this.newManager,
              role: 'Manager'
            });
            formData.append('managerId', managerResponse.data.id);
          } catch (error) {
            console.error('Error creating new manager:', error);
            return;
          }
        }
  
        try {
          const response = await axios.post('http://localhost:3000/api/chocolate-factories', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          console.log('Factory created:', response.data);
          this.$router.push('/');
        } catch (error) {
          console.error('Error creating factory:', error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Local styles */
  </style>
  