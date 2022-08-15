import { setAccessToken, deleteAccessToken } from '@/settings/axiosSettings'; // eslint-disable-line import/no-cycle
// eslint-disable-next-line import/no-cycle
import { changeRoute, addQueryItems } from '@/router/index';

export default {
  async _signUp({ commit }, user) {
    await this.$config.axios.post(`${this.$config.apiBasePath}auth/signup`, user);

    commit('changeSidebarMode', 'sign in', { root: true });
    addQueryItems({ sidebar: 'sign in' });
  },
  async _signIn({ commit, dispatch }, user) {
    try {
      const { data: responseUser } = await this.$config.axios
        .post(`${this.$config.apiBasePath}auth/signin`, user);

      commit('signIn', responseUser);
      commit('changeSidebarMode', 'lists', { root: true });
      changeRoute('home', null, { sidebar: 'lists' });
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
    changeRoute('auth', null, { sidebar: 'sign in' });
  },
  _setUserFromLocalStorage({ commit }) {
    const user = localStorage.getItem('user');

    if (user) {
      commit('signIn', JSON.parse(user));
    }
  },
};
