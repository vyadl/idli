import Vue from 'vue';
import store from '@/store/index'; // eslint-disable-line
import axios from 'axios';

Vue.prototype.$axios = axios;
Vue.prototype.$apiBasePath = process.env.VUE_APP_API_BASE_PATH;

axios.interceptors.request.use(config => {
  store.commit('setRequestStatus', true);
  store.commit('increaseRequestsNumber');

  return config;
});

axios.interceptors.response.use(
  response => {
    store.commit('decreaseRequestsNumber');

    if (store.state.requestsNumber === 0) {
      store.commit('setRequestStatus', false);
    }

    return response;
  },
  error => {
    if (error.response.data.message === 'Invalid JWT Token') {
      store.dispatch('auth/_signOut');
      store.dispatch('_openSidebar', 'auth');
    }

    store.commit('decreaseRequestsNumber');

    if (store.state.requestsNumber === 0) {
      store.commit('setRequestStatus', false);
    }

    throw error;
  },
);

export default {
  initAxios() {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
      axios.defaults.headers.common['x-access-token'] = user.accessToken;
    }
  },
  setAccessToken(token) {
    axios.defaults.headers.common['x-access-token'] = token;
  },
  deleteAccessToken() {
    delete axios.defaults.headers.common['x-access-token'];
  },
};
