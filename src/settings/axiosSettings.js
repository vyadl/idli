import axios from 'axios';
import { router } from '@/router'; // eslint-disable-line import/no-cycle
import getBrowserFingerprint from 'get-browser-fingerprint';

export const initAxios = function initAxios(store) {
  const apiBasePath = import.meta.env.VITE_API_BASE_PATH;
  const user = JSON.parse(localStorage.getItem('user'));
  const fingerprint = JSON.stringify(getBrowserFingerprint());

  axios.interceptors.response.use(
    response => {
      if (response.data.accessToken && response.data.refreshToken) {
        user.accessToken = response.accessToken;
        user.refreshToken = response.refreshToken;
        localStorage.setItem('user', JSON.stringify(user));
      }

      return response;
    },

    error => {
      if (axios.isCancel(error)) {
        throw new Error('The request is canceled');
      } 

      if (error.response?.status !== 401) {
        throw error;
      }

      if (error.response?.status === 401) {
        // store.dispatch('auth/_logOut');
        // router.push({ name: 'signIn' });
        console.log(error.response.status);
        axios.post(`${apiBasePath}auth/refresh`, {
          fingerprint,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
        })
          .then(response => {
            console.log(response);
          })

        // throw new Error('Invalid JWT Token');
      }
    },
  );
  
  if (user) {
    axios.defaults.headers.common['x-access-token'] = user.accessToken;
  }

  return {
    axios,
    apiBasePath,
  };
};

export const setAccessToken = function setAccessToken(token) {
  axios.defaults.headers.common['x-access-token'] = token;
};

export const deleteAccessToken = function deleteAccessToken() {
  delete axios.defaults.headers.common['x-access-token'];
};
