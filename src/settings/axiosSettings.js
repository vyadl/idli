import axios from 'axios';
import getBrowserFingerprint from 'get-browser-fingerprint';
import { router } from '@/router'; // eslint-disable-line import/no-cycle

const REFRESH_TRIGGER_ERROR_CODE = 'ACCESS_TOKEN_INVALID_ERROR';
const LOGOUT_TRIGGER_ERROR_CODES = new Set([
  'ACCESS_TOKEN_ABSENT_ERROR',
  'REFRESH_TOKEN_WRONG_ERROR',
  'REFRESH_TOKEN_EXPIRED_ERROR',
]);

const SIGNIN_ERROR_MESSAGE = 'Invalid username and/or password';
const WRONG_CODE_ERROR_MESSAGE = 'Validation code is invalid';
const EXPIRED_CODE_ERROR_MESSAGE = 'Validation code is expired. Please resend it.';

const ERROR_CODES_AND_MESSAGES_ACCORDANCE = {
  CREDENTIALS_ERROR: SIGNIN_ERROR_MESSAGE,
  NOT_FOUND_USER_ERROR: SIGNIN_ERROR_MESSAGE,
  DELETED_USER_ERROR: SIGNIN_ERROR_MESSAGE,

  SIGNUP_WRONG_CODE_ERROR: WRONG_CODE_ERROR_MESSAGE,
  SIGNUP_EXPIRED_CODE_ERROR: EXPIRED_CODE_ERROR_MESSAGE,

  RESET_PASSWORD_WRONG_CODE_ERROR: WRONG_CODE_ERROR_MESSAGE,
  RESET_PASSWORD_EXPIRED_CODE_ERROR: EXPIRED_CODE_ERROR_MESSAGE,
};

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
        router.push({ name: 'signIn' });
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

export function getErrorMessage(errorData) {
  const { code, message } = errorData;

  return ERROR_CODES_AND_MESSAGES_ACCORDANCE[code]
    || message
    || 'Something went wrong';
}

export function setAccessToken(token) {
  axios.defaults.headers.common['x-access-token'] = token;
}

export function deleteAccessToken() {
  delete axios.defaults.headers.common['x-access-token'];
}
