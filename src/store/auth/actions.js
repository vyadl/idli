import { setAccessToken, deleteAccessToken } from '@/settings/axiosSettings'; // eslint-disable-line import/no-cycle
import { router } from '@/router'; // eslint-disable-line import/no-cycle
import { addQueryItems } from '@/router/utils'; // eslint-disable-line import/no-cycle
import { dispatchFromRoot, commitFromRoot } from '@/store/store-utils'; // eslint-disable-line import/no-cycle

export default {
  async _signUp(user) {
    await this.$config.axios.post(`${this.$config.apiBasePath}auth/signup`, user);

    commitFromRoot('changeSidebarMode', 'sign in');
    addQueryItems({ sidebar: 'sign in' });
  },
  async _signIn({ commit }, user) {
    try {
      const { data: responseUser } = await this.$config.axios
        .post(`${this.$config.apiBasePath}auth/signin`, user);

      commit('signIn', responseUser);
      commitFromRoot('changeSidebarMode', 'lists');
      router.push({ name: 'home', query: { sidebar: 'lists' } });
      localStorage.setItem('user', JSON.stringify(responseUser));
      setAccessToken(responseUser.accessToken);
      dispatchFromRoot('_fetchListsForUser');
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
    commitFromRoot('closeSidebar');
  },
  _setUserFromLocalStorage({ commit }) {
    const user = localStorage.getItem('user');

    if (user) {
      commit('signIn', JSON.parse(user));
    }
  },
};
