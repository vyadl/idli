import { setAccessToken, deleteAccessToken } from '@/settings/axiosSettings'; // eslint-disable-line import/no-cycle

export default {
  async _signUp({ commit }, user) {
    await this.$conf.axios.post(`${this.$conf.apiBasePath}auth/signup`, user);

    commit('changeSidebarMode', 'sign in', { root: true });
  },
  async _signIn({ commit, dispatch }, user) {
    try {
      const { data: responseUser } = await this.$conf.axios
        .post(`${this.$conf.apiBasePath}auth/signin`, user);

      commit('signIn', responseUser);
      commit('changeSidebarMode', 'lists', { root: true });
      localStorage.setItem('user', JSON.stringify(responseUser));
      setAccessToken(responseUser.accessToken);
      dispatch('_fetchListsForUser', null, { root: true });
    } catch (error) {
      localStorage.removeItem('user');

      throw error;
    }
  },
  _logOut({ commit }) {
    commit('logOut');
    commit('closeSidebar', null, { root: true });
    localStorage.removeItem('user');
    localStorage.removeItem('currentListId');
    deleteAccessToken();
  },
  _setUserFromLocalStorage({ commit }) {
    const user = localStorage.getItem('user');

    if (user) {
      commit('signIn', JSON.parse(user));
    }
  },
};
