<template>
  <div id="app">
    <nav>
      <ul>
        <!-- Prikazivanje linkova za prijavu i registraciju samo ako korisnik nije prijavljen -->
        <li v-if="!isLoggedIn"><router-link to="/login">Login</router-link></li>
        <li v-if="!isLoggedIn"><router-link to="/register">Register</router-link></li>
        
        <!-- Prikazivanje korisničkog imena i uloge ako je korisnik prijavljen -->
        <li v-if="isLoggedIn">
          {{ userRole }}: {{ username }}
          <!-- Prikazivanje poena samo ako je korisnik kupac -->
          <span v-if="userRole === 'Customer'"> (Poeni: {{ userPoints }})</span>
        </li>

        <!-- Prikazivanje linkova specifičnih za korisničku ulogu -->
        <li v-if="isLoggedIn && userRole === 'Administrator'"><router-link to="/create-manager">Create Manager</router-link></li>
        <li v-if="isLoggedIn && userRole === 'Administrator'"><router-link to="/create-factory">Create Factory</router-link></li>
        <li v-if="isLoggedIn && userRole === 'Administrator'"><router-link to="/users">Users</router-link></li> <!-- Dodato -->
        <li v-if="isLoggedIn && userRole === 'Manager'"><router-link to="/create-worker">Create Worker</router-link></li>
        <li v-if="isLoggedIn && userRole === 'Customer'"><router-link :to="`/user/${userId}/my-purchases`">My purchases</router-link></li>
        <li v-if="isLoggedIn && userRole === 'Customer'"><router-link :to="`/user/${userId}/my-cart`">My Cart</router-link></li>
        <li v-if="isLoggedIn && userRole === 'Administrator'"><router-link to="/suspicious-users">Suspicious Users</router-link></li>
        <!-- Prikazivanje linka za profil i dugmeta za odjavu ako je korisnik prijavljen -->
        <li v-if="isLoggedIn"><router-link :to="`/user/${userId}/profile`">My Profile</router-link></li>
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
      userRole: '',
      userId: '', // Dodato za čuvanje ID-a korisnika
      userPoints: 0 // Dodato za čuvanje poena korisnika
    };
  },
  created() {
    const token = localStorage.getItem('token');
    if (token) {
      const user = JSON.parse(localStorage.getItem('user'));
      this.isLoggedIn = true;
      this.username = user.username;
      this.userRole = user.role;
      this.userId = user.id; // Postavljanje ID-a korisnika
      this.userPoints = user.points || 0; // Postavljanje poena korisnika, podrazumevano na 0 ako nije postavljeno
    }
  },
  methods: {
    handleLoginSuccess(user) {
      this.isLoggedIn = true;
      this.username = user.username;
      this.userRole = user.role;
      this.userId = user.id; // Postavljanje ID-a korisnika
      this.userPoints = user.points || 0; // Postavljanje poena korisnika, podrazumevano na 0 ako nije postavljeno
      localStorage.setItem('user', JSON.stringify(user));
    },
    logout() {
      this.isLoggedIn = false;
      this.username = '';
      this.userRole = '';
      this.userId = ''; // Resetovanje ID-a korisnika
      this.userPoints = 0; // Resetovanje poena korisnika
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.$router.push('/');
    }
  }
};
</script>

<style>
/* Global styles */
nav ul {
  list-style-type: none;
  padding: 0;
}

nav ul li {
  display: inline;
  margin-right: 10px;
}

nav ul li button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  color: blue;
}

nav ul li button:hover {
  color: darkblue;
}
</style>
