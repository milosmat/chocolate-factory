import Vue from 'vue';
import Vuex from 'vuex';
import auth from './auth';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    clearUser(state) {
      state.user = null;
    }
  },
  actions: {
    async fetchUser({ commit }) {
      const user = JSON.parse(localStorage.getItem('user'));
      commit('setUser', user);
    }
  },
  modules: {
    auth
  }
});