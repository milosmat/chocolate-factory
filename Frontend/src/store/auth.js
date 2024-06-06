import axios from 'axios';

const state = {
  token: localStorage.getItem('token') || '',
  user: {},
  status: ''
};

const getters = {
  isLoggedIn: state => !!state.token,
  authStatus: state => state.status,
  user: state => state.user
};

const actions = {
  async login({ commit }, user) {
    try {
      commit('auth_request');
      const response = await axios.post('/api/auth/login', user);
      const token = response.data.token;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = token;
      commit('auth_success', token);
    } catch (error) {
      commit('auth_error');
      localStorage.removeItem('token');
      throw error;
    }
  },
  async register({ commit }, user) {
    try {
      commit('auth_request');
      const response = await axios.post('/api/auth/register', user);
      const token = response.data.token;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = token;
      commit('auth_success', token);
    } catch (error) {
      commit('auth_error');
      localStorage.removeItem('token');
      throw error;
    }
  },
  logout({ commit }) {
    commit('logout');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  }
};

const mutations = {
  auth_request(state) {
    state.status = 'loading';
  },
  auth_success(state, token) {
    state.status = 'success';
    state.token = token;
  },
  auth_error(state) {
    state.status = 'error';
  },
  logout(state) {
    state.status = '';
    state.token = '';
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
