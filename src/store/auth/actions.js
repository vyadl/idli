export default {
  _register(state, user) {
    return this._vm.$axios({
      method: 'post',
      url: 'https://api.idli.space/api/auth/signup',
      data: user,
    }).then(response => response);
  },
  _logIn({ commit }, user) {
    return this._vm.$axios({
      method: 'post',
      url: 'https://api.idli.space/api/auth/signin',
      data: user,
    })
      .then(response => {
        const { accessToken } = response.data;

        commit('logIn', response.data);
        localStorage.setItem('accessToken', JSON.stringify(accessToken));
        this._vm.$axios.defaults.headers.common.Authorization = accessToken;

        return response;
      })
      .catch(error => {
        localStorage.removeItem('accessToken');

        throw error;
      });
  },
  _logOut({ commit }) {
    commit('logOut');
    localStorage.removeItem('accessToken');
    delete this._vm.$axios.defaults.headers.common.Authorization;
  },
};
