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
      <input v-model="role" placeholder="Role" required />
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

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
  methods: {
    async register() {
      if (this.password !== this.confirmPassword) {
        console.error('Passwords do not match!');
        return;
      }
      try {
        const response = await axios.post('/api/auth/register', {
          username: this.username,
          password: this.password,
          firstName: this.firstName,
          lastName: this.lastName,
          gender: this.gender,
          dateOfBirth: this.dateOfBirth,
          role: this.role
        });
        console.log('Registered:', response.data);
        this.$emit('login-success', response.data);
        this.$router.push('/');
      } catch (error) {
        console.error('Error registering:', error);
      }
    }
  }
};
</script>
