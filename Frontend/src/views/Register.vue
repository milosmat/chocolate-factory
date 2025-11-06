<template>
  <div>
    <h1>Register</h1>
    <form @submit.prevent="register">
      <input v-model="username" placeholder="Username" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <input v-model="confirmPassword" type="password" placeholder="Confirm Password" required />
      <input v-model="firstName" placeholder="First Name" required />
      <input v-model="lastName" placeholder="Last Name" required />
      <input v-model="gender" placeholder="Gender" required />
      <input v-model="dateOfBirth" type="date" placeholder="Date of Birth" required />
      <button type="submit">Register</button>
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
      dateOfBirth: '',
      role: 'Customer' // Pretpostavljamo da korisnik može registrovati samo kao Kupac
    };
  },
  computed: {
    formattedDateOfBirth() {
      return this.dateOfBirth ? moment(this.dateOfBirth).format('YYYY-MM-DD') : '';
    }
  },
  methods: {
    async register() {
      console.log('Register method called');
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
          role: this.role
        };
        console.log('Sending request to /api/auth/register with data:', userData);
        const response = await axios.post('http://localhost:8080/api/auth/register', userData);
        console.log('Registered:', response.data);
        this.$emit('login-success', response.data);
        this.$router.push('/');
      } catch (error) {
        if (error.response) {
          console.error('Error registering:', error.response.data);
          console.error('Validation errors:', error.response.data.errors);
          // Log each validation error
          error.response.data.errors.forEach(err => console.error(err));
        } else {
          console.error('Error registering:', error.message);
        }
      }
    }
  }
};
</script>
