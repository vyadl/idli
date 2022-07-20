import axios from 'axios';

export const initAxios = function initAxios(store) {
  axios.interceptors.request.use(config => {
    store.commit('increaseRequestsNumber');

    return config;
  });

  axios.interceptors.response.use(
    response => {
      store.commit('decreaseRequestsNumber');

      return response;
    },
    error => {
      if (error.response.data.message === 'Invalid JWT Token') {
        store.dispatch('auth/_logOut');
        store.dispatch('_openSidebar', 'sign in');
      }

      store.commit('decreaseRequestsNumber');

      throw error;
    },
  );

  const user = JSON.parse(localStorage.getItem('user'));

  if (user) {
    axios.defaults.headers.common['x-access-token'] = user.accessToken;
  }

  return {
    axios,
    apiBasePath: process.env.VUE_APP_API_BASE_PATH,
  };
};

export const setAccessToken = function setAccessToken(token) {
  axios.defaults.headers.common['x-access-token'] = token;
};

export const deleteAccessToken = function deleteAccessToken() {
  delete axios.defaults.headers.common['x-access-token'];
};
