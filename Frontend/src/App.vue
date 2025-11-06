<template>
  <div id="app">
    <nav>
      <ul>
        <li v-if="!isLoggedIn"><router-link to="/login">Login</router-link></li>
        <li v-if="!isLoggedIn"><router-link to="/register">Register</router-link></li>
        <li v-if="isLoggedIn">{{ userRole }}: {{ username }}</li>
        <li v-if="isLoggedIn"><button @click="logout">Logout</button></li>
      </ul>
    </nav>
    <router-view @login-success="handleLoginSuccess" />
  </div>
</template>

<script>

export default {
  data() {
    return {
      isLoggedIn: false,
      username: '',
      userRole: ''
    };
  },
  methods: {
    handleLoginSuccess(user) {
      this.isLoggedIn = true;
      this.username = user.username;
      this.userRole = user.role;
    },
    logout() {
      this.isLoggedIn = false;
      this.username = '';
      this.userRole = '';
      // Here you can also clear any tokens if you use them for authentication
      this.$router.push('/');
    }
  }
};
</script>

<style>
/* Global styles */
</style>
