import Vue from 'vue';
import Router from 'vue-router';
import FactoryList from '../components/FactoryList.vue';
import AddChocolate from '../components/AddChocolate.vue';
import FactoryDetails from '../components/FactoryDetails.vue';
import EditChocolate from '../components/EditChocolate.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import CreateManager from '../components/CreateManager.vue';
import CreateWorker from '../components/CreateWorker.vue';
import CreateFactory from '../components/CreateFactory.vue';
import MyPurchases from '../components/MyPurchases.vue';
import FactoryPurchases from '../components/FactoryPurchases.vue';
import MyCart from '../components/MyCart.vue';
import UserProfile from '../components/UserProfile.vue';
import UserList from '../components/UserList';

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
    },
    {
      path: '/create-manager',
      name: 'CreateManager',
      component: CreateManager
    },
    {
      path: '/create-worker/:factoryId',
      name: 'CreateWorker',
      component: CreateWorker,
      meta: { requiresAuth: true, requiresManager: true }
    },
    {
      path: '/create-factory',
      name: 'CreateFactory',
      component: CreateFactory
    },
    {
      path: '/user/:userId/my-purchases',
      name: 'MyPurchases',
      component: MyPurchases
    },
    {
      path: '/factory/:factoryId/manager/:managerId/purchases',
      name: 'FactoryPurchases',
      component: FactoryPurchases
    },
    {
      path: '/user/:userId/my-cart',
      name: 'MyCart',
      component: MyCart
    },
    {
      path: '/user/:userId/profile',
      name: 'UserProfile',
      component: UserProfile
    },
    {
      path: '/users',
      name: 'UserList',
      component: UserList
    }
  ]
});

export default router;
