import axios from 'axios';
import getBrowserFingerprint from 'get-browser-fingerprint';
import { LOGOUT_TRIGGER_ERROR_CODES, REFRESH_TRIGGER_ERROR_CODE } from '@/backendInteraction/serverErrors';

export function initAxios(store) {
  const apiBasePath = import.meta.env.VITE_API_BASE_PATH;
  const savedUser = JSON.parse(localStorage.getItem('user'));

  if (savedUser) {
    setAccessToken(savedUser.accessToken);
  }

  axios.interceptors.response.use(
    response => response,

    error => {
      const fingerprint = JSON.stringify(getBrowserFingerprint());
      const user = JSON.parse(localStorage.getItem('user'));
      const { code } = error.response.data;

      if (axios.isCancel(error)) {
        throw new Error('The request is canceled');
      }

      if (LOGOUT_TRIGGER_ERROR_CODES.has(code)) {
        store.dispatch('auth/_logOut', { mode: 'current' });
      }

      if (code !== REFRESH_TRIGGER_ERROR_CODE || error.config.retry) {
        throw error;
      }
      
      return axios.post(`${apiBasePath}auth/refresh`, {
        fingerprint,
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
      })
        .then(response => {
          user.accessToken = response.data.accessToken;
          user.refreshToken = response.data.refreshToken;

          localStorage.setItem('user', JSON.stringify(user));
          setAccessToken(response.data.accessToken);

          const newRequest = {
            ...error.config,
            retry: true,
          };

          newRequest.headers['x-access-token'] = response.data.accessToken;
    
          return axios(newRequest);
        });
    },
  );

  return {
    axios,
    apiBasePath,
  };
}

export function setAccessToken(token) {
  axios.defaults.headers.common['x-access-token'] = token;
}

export function deleteAccessToken() {
  delete axios.defaults.headers.common['x-access-token'];
}
