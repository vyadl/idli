import axios from 'axios';
import { router } from '@/router'; // eslint-disable-line import/no-cycle
import getBrowserFingerprint from 'get-browser-fingerprint';

export const initAxios = function initAxios(store) {
  const apiBasePath = import.meta.env.VITE_API_BASE_PATH;
  const user = JSON.parse(localStorage.getItem('user'));
  const fingerprint = JSON.stringify(getBrowserFingerprint());

  axios.interceptors.response.use(
    response => {
      console.log(response);
      console.log(user);
      if (user && response.data.accessToken && response.data.refreshToken) {
        user.accessToken = response.data.accessToken;
        user.refreshToken = response.data.refreshToken;
        localStorage.setItem('user', JSON.stringify(user));
      }

      return response;
    },

    async error => {
      if (axios.isCancel(error)) {
        throw new Error('The request is canceled');
      } 

      if (error.response?.status !== 401 && error.config.retry) {
        throw error;
      }

      if (error.response?.status === 401) {
        console.log(error.response.status);
        const res = await axios.post(`${apiBasePath}auth/refresh`, {
          fingerprint,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
        });
        console.log(res);

        const newRequest = {
          ...error.config,
          retry: true,
        };

        return axios(newRequest);

        // store.dispatch('auth/_logOut');
        // router.push({ name: 'signIn' });
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
