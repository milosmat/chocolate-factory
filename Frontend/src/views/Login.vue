<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="login">
      <input v-model="username" placeholder="Username" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
      <p v-if="errorMessage">{{ errorMessage }}</p> <!-- Dodato za prikazivanje greške -->
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
      errorMessage: '' // Dodato za prikazivanje greške
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
        const { token, user } = response.data;

        if (user.isBlocked) {
          this.errorMessage = 'Vaš nalog je blokiran. Kontaktirajte administratora za više informacija.';
        } else {
          // Čuvanje tokena i podataka o korisniku u localStorage
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));

          this.$emit('login-success', user);
          this.$router.push('/'); // Preusmeri na početnu stranicu ili dashboard
        }
      } catch (error) {
        console.error('Error logging in:', error);
        this.errorMessage = 'Neispravno korisničko ime ili lozinka.'; // Dodato za prikazivanje greške
      }
    }
  }
};
</script>
