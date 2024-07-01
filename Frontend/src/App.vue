<template>
  <div id="app">
    <nav>
      <ul>
        <li v-if="!isLoggedIn"><router-link to="/login">Login</router-link></li>
        <li v-if="!isLoggedIn"><router-link to="/register">Register</router-link></li>
        <li v-if="isLoggedIn">{{ userRole }}: {{ username }}</li>
        <li v-if="isLoggedIn && userRole === 'Administrator'"><router-link to="/create-manager">Create Manager</router-link></li>
        <li v-if="isLoggedIn && userRole === 'Administrator'"><router-link to="/create-factory">Create Factory</router-link></li>
        <li v-if="isLoggedIn && userRole === 'Manager'"><router-link to="/create-worker">Create Worker</router-link></li>
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
  created() {
    const token = localStorage.getItem('token');
    if (token) {
      const user = JSON.parse(localStorage.getItem('user'));
      this.isLoggedIn = true;
      this.username = user.username;
      this.userRole = user.role;
    }
  },
  methods: {
    handleLoginSuccess(user) {
      this.isLoggedIn = true;
      this.username = user.username;
      this.userRole = user.role;
      localStorage.setItem('user', JSON.stringify(user));
    },
    logout() {
      this.isLoggedIn = false;
      this.username = '';
      this.userRole = '';
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.$router.push('/');
    }
  }
};
</script>

<style>
/* Global styles */
</style>
