import axiosSettings from '@/settings/axiosSettings'; // eslint-disable-line

export default {
  async _signUp({ commit }, user) {
    await this._vm.$axios.post(`${this._vm.$apiBasePath}auth/signup`, user);

    commit('changeSidebarMode', 'sign in', { root: true });
  },
  async _signIn({ commit, dispatch }, user) {
    try {
      const { data: responseUser } = await this._vm.$axios
        .post(`${this._vm.$apiBasePath}auth/signin`, user);

      commit('signIn', responseUser);
      commit('changeSidebarMode', 'lists', { root: true });
      localStorage.setItem('user', JSON.stringify(responseUser));
      axiosSettings.setAccessToken(responseUser.accessToken);
      dispatch('_fetchListsForUser', null, { root: true });
    } catch (error) {
      localStorage.removeItem('user');

      throw error;
    }
  },
  _signOut({ commit }) {
    commit('signOut');
    commit('closeSidebar', null, { root: true });
    localStorage.removeItem('user');
    localStorage.removeItem('currentListId');
    axiosSettings.deleteAccessToken();
  },
  _setUserFromLocalStorage({ commit }) {
    const user = localStorage.getItem('user');

    if (user) {
      commit('signIn', JSON.parse(user));
    }
  },
};
