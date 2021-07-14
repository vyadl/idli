import axios from 'axios';

export default {
  initAxios() {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      axios.defaults.headers.common.Authorization = accessToken; // eslint-disable-line
    }
  },
};
