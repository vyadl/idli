import axiosSettings from '@/settings/axiosSettings'; // eslint-disable-line

export default {
  _register({ commit }, user) {
    commit('setRequestStatus', 'processing');
    return this._vm.$axios.post(`${this._vm.$apiBasePath}auth/signup`, user)
      .then(response => response)
      .finally(() => commit('setRequestStatus', null));
  },
  _logIn({ commit }, user) {
    commit('setRequestStatus', 'processing');
    return this._vm.$axios.post(`${this._vm.$apiBasePath}auth/signin`, user)
      .then(response => {
        commit('logIn', response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
        axiosSettings.setAccessToken(response.data.accessToken);

        return response;
      })
      .catch(error => {
        localStorage.removeItem('user');

        throw error;
      })
      .finally(() => commit('setRequestStatus', null));
  },
  _logOut({ commit }) {
    commit('logOut');
    localStorage.removeItem('user');
    axiosSettings.deleteAccessToken();
  },
};
