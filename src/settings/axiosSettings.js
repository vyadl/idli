import axios from 'axios';
import { router } from '@/router'; // eslint-disable-line import/no-cycle
import getBrowserFingerprint from 'get-browser-fingerprint';

export const initAxios = function initAxios(store) {
  const apiBasePath = import.meta.env.VITE_API_BASE_PATH;
  const fingerprint = JSON.stringify(getBrowserFingerprint());
  const userInitial = JSON.parse(localStorage.getItem('user'));

  if (userInitial) {
    axios.defaults.headers.common['x-access-token'] = userInitial.accessToken;
  }

  axios.interceptors.response.use(
    response => {
      const user = JSON.parse(localStorage.getItem('user'));
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
      const user = JSON.parse(localStorage.getItem('user'));
      console.log(user);
      if (axios.isCancel(error)) {
        throw new Error('The request is canceled');
      } 

      if (error.response?.status !== 401 || error.config.retry) {
        throw error;
      }

      // console.log(error.response.status);
      // console.log(error.response.data.message);

      const args = {
        fingerprint,
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
      };
      console.log(args);

      const res = await axios.post(`${apiBasePath}auth/refresh`, args);

      console.log(res);
        // .then(res => {
        //   console.log(res);
        //   const newRequest = {
        //     ...error.config,
        //     retry: true,
        //   };
    
        //   return axios(newRequest);
        // })
        // .catch(refreshError => {
        //   throw refreshError;
        // });

      // user.accessToken = response.data.accessToken;
      // user.refreshToken = response.data.refreshToken;
      // localStorage.setItem('user', JSON.stringify(user));


      // store.dispatch('auth/_logOut');
      // router.push({ name: 'signIn' });
      // throw new Error('e');
    },
  );

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
