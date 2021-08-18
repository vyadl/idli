import Vue from 'vue';
import store from '@/store/index'; // eslint-disable-line
import axios from 'axios';

Vue.prototype.$axios = axios;
Vue.prototype.$apiBasePath = process.env.VUE_APP_API_BASE_PATH;

axios.interceptors.response.use(response => response,
  error => {
    if (error.response.data.message === 'Invalid JWT Token') {
      store.dispatch('auth/_signOut');
      store.dispatch('_openSidebar', 'auth');
    }

    throw error;
  });

export const initAxios = function initAxios() {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user) {
    axios.defaults.headers.common['x-access-token'] = user.accessToken;
  }
};

export const setAccessToken = function setAccessToken(token) {
  axios.defaults.headers.common['x-access-token'] = token;
};

export const deleteAccessToken = function deleteAccessToken() {
  delete axios.defaults.headers.common['x-access-token'];
};
