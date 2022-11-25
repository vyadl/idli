import { setAccessToken, deleteAccessToken } from '@/settings/axiosSettings'; // eslint-disable-line import/no-cycle
import { router } from '@/router'; // eslint-disable-line import/no-cycle
import { commitFromRoot, dispatchFromRoot } from '@/store/utils'; // eslint-disable-line import/no-cycle
import getBrowserFingerprint from 'get-browser-fingerprint';

export default {
  _requestRegistration(state, { email, username }) {
    commitFromRoot('increaseExplicitRequestsNumber');
    this.$config.axios.post(
      `${this.$config.apiBasePath}auth/signup-validate`,
      {
        email,
        username,
      },
    )
      .then(() => {
        router.push({ 
          name: 'signUp',
          query: {
            email,
            username,
          },
        });
      })
      .catch(error => {
        throw error;
      })
      .finally(() => {
        commitFromRoot('decreaseExplicitRequestsNumber');
      });
  },

  async _signUp(state, user) {
    commitFromRoot('increaseExplicitRequestsNumber');
    this.$config.axios.post(
      `${this.$config.apiBasePath}auth/signup`,
      user,
    )
      .then(() => {
        commitFromRoot('setNotification', { text: 'Registration is successful' });
        router.push({ name: 'signIn' });
      })
      .catch(error => {
        throw error;
      })
      .finally(() => {
        commitFromRoot('decreaseExplicitRequestsNumber');
      });
  },

  async _signIn({ commit }, { username, password }) {
    const fingerprint = JSON.stringify(getBrowserFingerprint());

    commitFromRoot('increaseExplicitRequestsNumber');

    try {
      const { data: responseUser } = await this.$config.axios.post(
        `${this.$config.apiBasePath}auth/signin`,
        {
          username,
          password,
          fingerprint,
        },
      );
      
      commit('signIn', responseUser);
      router.push({ name: 'home', query: { sidebar: 'lists' } });
      localStorage.setItem('user', JSON.stringify(responseUser));
      setAccessToken(responseUser.accessToken);
    } catch (error) {
      localStorage.removeItem('user');

      throw error;
    } finally {
      commitFromRoot('decreaseExplicitRequestsNumber');
    }
  },

  _requestResetPassword(state, email) {
    commitFromRoot('increaseExplicitRequestsNumber');

    this.$config.axios.post(
      `${this.$config.apiBasePath}auth/request-reset-password`,
      { email },
    )
      .then(() => {
        router.push({
          name: 'resetPassword',
          query: { email },
        });
      })
      .catch(error => {
        throw error;
      })
      .finally(() => {
        commitFromRoot('decreaseExplicitRequestsNumber');
      });
  },

  _resetPassword(state, { email, code, password }) {
    commitFromRoot('increaseExplicitRequestsNumber');

    this.$config.axios.post(
      `${this.$config.apiBasePath}auth/reset-password`,
      { 
        email,
        code,
        password,
      },
    )
      .then(() => {
        commitFromRoot('setNotification', { text: 'Password reset is successful' });
        router.push({ name: 'signIn' });
      })
      .catch(error => {
        throw error;
      })
      .finally(() => {
        commitFromRoot('decreaseExplicitRequestsNumber');
      });
  },

  _changePassword(state, {
    oldPassword,
    newPassword,
    isLogoutFromAllDevices,
  }) {
    const fingerprint = JSON.stringify(getBrowserFingerprint());
    const user = JSON.parse(localStorage.getItem('user'));

    commitFromRoot('increaseExplicitRequestsNumber');

    this.$config.axios.post(
      `${this.$config.apiBasePath}auth/change-password`,
      { 
        email: user.email,
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
        oldPassword,
        newPassword,
        isLogoutFromAllDevices,
        fingerprint,
      },
    )
      .then(() => {
        commitFromRoot('setNotification', { text: 'Password successfully changed' });
      })
      .catch(error => {
        throw error;
      })
      .finally(() => {
        commitFromRoot('decreaseExplicitRequestsNumber');
      });
  },

  _logOut({ commit }, { mode }) {
    const fingerprint = JSON.stringify(getBrowserFingerprint());
    const user = JSON.parse(localStorage.getItem('user'));

    commitFromRoot('increaseExplicitRequestsNumber');

    this.$config.axios.post(
      `${this.$config.apiBasePath}auth/logout`,
      {
        mode,
        fingerprint,
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
        userId: user.id,
      },
    )
      .then(response => {
        // if (mode !== 'allExceptCurrent') {
        //   console.log(response);
        //   commit('logOut');
        //   localStorage.removeItem('user');
        //   localStorage.removeItem('currentListId');
        //   deleteAccessToken();
        //   commitFromRoot('sidebar/closeSidebar');
        //   commitFromRoot('filters/resetFilters');
        //   commitFromRoot('setCurrentListItems', []);
        //   dispatchFromRoot('visualization/_resetVisualizationToDefault');
        //   router.push({ name: 'auth' });
        // }
        commitFromRoot('setNotification', { text: `${response.data}` });
      })
      .catch(error => {
        throw error;
      })
      .finally(() => {
        commitFromRoot('decreaseExplicitRequestsNumber');
      });

    if (mode !== 'allExceptCurrent') {
      commit('logOut');
      localStorage.removeItem('user');
      localStorage.removeItem('currentListId');
      deleteAccessToken();
      commitFromRoot('sidebar/closeSidebar');
      commitFromRoot('filters/resetFilters');
      commitFromRoot('setCurrentListItems', []);
      dispatchFromRoot('visualization/_resetVisualizationToDefault');
      router.push({ name: 'auth' });
    }
  },
  
  _setUserFromLocalStorage({ commit }) {
    const user = localStorage.getItem('user');

    if (user) {
      commit('signIn', JSON.parse(user));
    }
  },
};
