import axios from 'axios';
import store from '@/store/index'; // eslint-disable-line

axios.interceptors.response.use(response => response,
  error => {
    if (error.response.data.message === 'Invalid JWT Token') {
      store.dispatch('auth/_logOut');
      store.dispatch('_openSidebar', 'auth');
    }
    throw error;
  });

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
