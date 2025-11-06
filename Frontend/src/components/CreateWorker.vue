<template>
  <div>
    <h1>Create Worker</h1>
    <form @submit.prevent="createWorker">
      <input v-model="username" placeholder="Username" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <input v-model="confirmPassword" type="password" placeholder="Confirm Password" required />
      <input v-model="firstName" placeholder="First Name" required />
      <input v-model="lastName" placeholder="Last Name" required />
      <input v-model="gender" placeholder="Gender" required />
      <input v-model="dateOfBirth" type="date" placeholder="Date of Birth" required />
      <button type="submit">Create Worker</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';

export default {
  data() {
    return {
      username: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      gender: '',
      dateOfBirth: ''
    };
  },
  computed: {
    formattedDateOfBirth() {
      return this.dateOfBirth ? moment(this.dateOfBirth).format('YYYY-MM-DD') : '';
    }
  },
  methods: {
    async createWorker() {
      console.log('Create Worker method called');
      if (this.password !== this.confirmPassword) {
        console.error('Passwords do not match!');
        return;
      }
      try {
        const userData = {
          username: this.username,
          password: this.password,
          confirmPassword: this.confirmPassword,
          firstName: this.firstName,
          lastName: this.lastName,
          gender: this.gender,
          dateOfBirth: this.formattedDateOfBirth,
          role: 'Worker'
        };
        console.log('Sending request to /api/auth/register with data:', userData);
        const response = await axios.post('http://localhost:8080/api/auth/register', userData);
        console.log('Worker created:', response.data);

        // Add worker to the factory
        const factoryId = this.$route.params.factoryId; // Uverite se da je factoryId prosleđen u ruti
        console.log('Factory id = ' + factoryId)
        await axios.put(`http://localhost:8080/api/chocolate-factories/${factoryId}/add-worker`, { workerId: response.data.id.toString() }, {
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        });

        this.$router.push(`/factory/${factoryId}`);
      } catch (error) {
        if (error.response) {
          console.error('Error creating worker:', error.response.data);
          if (error.response.data.errors) {
            console.error('Validation errors:', error.response.data.errors);
          }
        } else {
          console.error('Error creating worker:', error.message);
        }
      }
    }

  }
};
</script>
