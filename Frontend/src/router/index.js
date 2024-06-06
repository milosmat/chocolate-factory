// router/index.js
import Vue from 'vue';
import Router from 'vue-router';
import FactoryList from '../components/FactoryList.vue';
import AddChocolate from '../components/AddChocolate.vue';
import FactoryDetails from '../components/FactoryDetails.vue';
import EditChocolate from '../components/EditChocolate.vue'; // Import EditChocolate component
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'FactoryList',
      component: FactoryList
    },
    {
      path: '/add-chocolate/:factoryId',
      name: 'AddChocolate',
      component: AddChocolate
    },
    {
      path: '/factory/:id',
      name: 'FactoryDetails',
      component: FactoryDetails
    },
    {
      path: '/edit-chocolate/:id',
      name: 'EditChocolate',
      component: EditChocolate
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    }
  ]
});

export default router;
