import { setAccessToken, deleteAccessToken } from '@/settings/axiosSettings'; // eslint-disable-line import/no-cycle
// eslint-disable-next-line import/no-cycle
import { router } from '@/router';
import { addQueryItems } from '@/router/utils';

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
      router.push({ name: 'home', query: { sidebar: 'lists' } });
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
    localStorage.removeItem('user');
    localStorage.removeItem('currentListId');
    deleteAccessToken();
    router.push({ name: 'auth' });
  },
  _setUserFromLocalStorage({ commit }) {
    const user = localStorage.getItem('user');

    if (user) {
      commit('signIn', JSON.parse(user));
    }
  },
};
