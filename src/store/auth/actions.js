import axiosSettings from '@/settings/axiosSettings'; // eslint-disable-line

export default {
  _signUp({ commit }, user) {
    commit('startRequestProcessing');

    return this._vm.$axios.post(`${this._vm.$apiBasePath}auth/signup`, user)
      .then(response => {
        commit('changeSidebarMode', 'sign in', { root: true });

        return response;
      })
      .finally(() => { commit('finishRequestProcessing'); });
  },
  _signIn({ commit }, user) {
    commit('startRequestProcessing');

    return this._vm.$axios.post(`${this._vm.$apiBasePath}auth/signin`, user)
      .then(response => {
        commit('signIn', response.data);
        commit('changeSidebarMode', 'profile', { root: true });
        localStorage.setItem('user', JSON.stringify(response.data));
        axiosSettings.setAccessToken(response.data.accessToken);

        return response;
      })
      .catch(error => {
        localStorage.removeItem('user');

        throw error;
      })
      .finally(() => { commit('finishRequestProcessing'); });
  },
  _signOut({ commit }) {
    commit('signOut');
    commit('closeSidebar', null, { root: true });
    localStorage.removeItem('user');
    axiosSettings.deleteAccessToken();
  },
  _initUser({ commit }) {
    const user = localStorage.getItem('user');

    if (user) {
      commit('signIn', JSON.parse(user));
    }
  },
};
