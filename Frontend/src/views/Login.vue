<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="login">
      <input v-model="username" placeholder="Username" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('/api/auth/login', {
          username: this.username,
          password: this.password
        });
        console.log('Logged in:', response.data);
        this.$emit('login-success', response.data);
        this.$router.push('/'); // Preusmeri na početnu stranicu ili dashboard
      } catch (error) {
        console.error('Error logging in:', error);
      }
    }
  }
};
</script>
