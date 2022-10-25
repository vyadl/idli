import { setAccessToken, deleteAccessToken } from '@/settings/axiosSettings'; // eslint-disable-line import/no-cycle
import { router } from '@/router'; // eslint-disable-line import/no-cycle
import { addQueryItems } from '@/router/utils'; // eslint-disable-line import/no-cycle
import { commitFromRoot, dispatchFromRoot } from '@/store/utils'; // eslint-disable-line import/no-cycle

export default {
  async _signUp(state, user) {
    commitFromRoot('increaseExplicitRequestsNumber');
    await this.$config.axios.post(
      `${this.$config.apiBasePath}auth/signup`,
      user,
    );
    commitFromRoot('decreaseExplicitRequestsNumber');
    commitFromRoot('setNotification', { text: 'Registration is successful' });
    commitFromRoot('sidebar/changeSidebarMode', 'sign in');
    addQueryItems({ sidebar: 'sign in' });
  },

  async _signIn({ commit }, user) {
    commitFromRoot('increaseExplicitRequestsNumber');

    try {
      const { data: responseUser } = await this.$config.axios.post(
        `${this.$config.apiBasePath}auth/signin`,
        user,
      );
      
      commitFromRoot('decreaseExplicitRequestsNumber');
      commit('signIn', responseUser);
      router.push({ name: 'home', query: { sidebar: 'lists' } });
      localStorage.setItem('user', JSON.stringify(responseUser));
      setAccessToken(responseUser.accessToken);
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
    commitFromRoot('sidebar/closeSidebar');
    commitFromRoot('filters/resetFilters');
    dispatchFromRoot('visualization/_resetVisualizationToDefault');
    commitFromRoot('lists/setCurrentListItems', []);
  },
  
  _setUserFromLocalStorage({ commit }) {
    const user = localStorage.getItem('user');

    if (user) {
      commit('signIn', JSON.parse(user));
    }
  },
};
