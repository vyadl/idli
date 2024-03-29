import getBrowserFingerprint from 'get-browser-fingerprint';
import { setAccessToken, deleteAccessToken } from '@/backendInteraction/axiosSettings'; // eslint-disable-line import/no-cycle
import { getErrorMessage } from '@/backendInteraction/serverErrors';
import { router } from '@/router'; // eslint-disable-line import/no-cycle
import { commitFromRoot, dispatchFromRoot } from '@/store/utils'; // eslint-disable-line import/no-cycle

export default {
  _getPublicListsForAuthScreen() {
    return this.$config.axios
      .get(`${this.$config.apiBasePath}mascot-list-titles`)
      .then(response => response.data.titles)
      .catch(error => {
        throw getErrorMessage(error.response.data);
      });
  },

  _requestRegistration({ dispatch }, { email, username }) {
    commitFromRoot('increaseExplicitRequestsNumber');

    return this.$config.axios.post(
      `${this.$config.apiBasePath}auth/signup-validate`,
      {
        email,
        username,
      },
    )
      .then(response => {
        router.push({ 
          name: 'signUp',
          query: {
            email,
            username,
          },
        });
        
        dispatch('_setCodeLifetimeInMinutes', response.data.codeLifetimeInMinutes);
        commitFromRoot('setNotification', { text: 'Email with validation code has been sent' });
      })
      .catch(error => {
        throw getErrorMessage(error.response.data);
      })
      .finally(() => {
        commitFromRoot('decreaseExplicitRequestsNumber');
      });
  },

  _signUp(state, user) {
    commitFromRoot('increaseExplicitRequestsNumber');

    return this.$config.axios.post(
      `${this.$config.apiBasePath}auth/signup`,
      user,
    )
      .then(() => {
        commitFromRoot('setNotification', { text: 'Registration is successful' });
        router.push({ name: 'signIn' });
      })
      .catch(error => {
        throw getErrorMessage(error.response.data);
      })
      .finally(() => {
        commitFromRoot('decreaseExplicitRequestsNumber');
      });
  },

  _signIn({ commit }, credentials) {
    const fingerprint = JSON.stringify(getBrowserFingerprint());

    commitFromRoot('increaseExplicitRequestsNumber');

    return this.$config.axios.post(
      `${this.$config.apiBasePath}auth/signin`,
      {
        ...credentials,
        fingerprint,
      },
    )
      .then(({ data: responseUser }) => {
        commit('signIn', responseUser);
        router.push({ name: 'home', query: { sidebar: 'lists' } });
        localStorage.setItem('user', JSON.stringify(responseUser));
        setAccessToken(responseUser.accessToken);
      })
      .catch(error => {
        localStorage.removeItem('user');

        throw getErrorMessage(error.response.data);
      })
      .finally(() => {
        commitFromRoot('decreaseExplicitRequestsNumber');
      });
  },

  _requestResetPassword({ dispatch }, email) {
    commitFromRoot('increaseExplicitRequestsNumber');

    return this.$config.axios.post(
      `${this.$config.apiBasePath}auth/request-reset-password`,
      { email },
    )
      .then(response => {
        router.push({
          name: 'resetPassword',
          query: { email },
        });

        dispatch('_setCodeLifetimeInMinutes', response.data.codeLifetimeInMinutes);
        commitFromRoot('setNotification', { text: 'Email with validation code has been sent' });
      })
      .catch(error => {
        throw getErrorMessage(error.response.data);
      })
      .finally(() => {
        commitFromRoot('decreaseExplicitRequestsNumber');
      });
  },

  _resetPassword(state, { email, code, password }) {
    commitFromRoot('increaseExplicitRequestsNumber');

    return this.$config.axios.post(
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
        throw getErrorMessage(error.response.data);
      })
      .finally(() => {
        commitFromRoot('decreaseExplicitRequestsNumber');
      });
  },

  _changePassword(state, {
    currentPassword,
    newPassword,
    isLogoutFromAllDevices,
  }) {
    const fingerprint = JSON.stringify(getBrowserFingerprint());
    const user = JSON.parse(localStorage.getItem('user'));

    commitFromRoot('increaseExplicitRequestsNumber');

    return this.$config.axios.post(
      `${this.$config.apiBasePath}auth/change-password`,
      { 
        email: user.email,
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
        currentPassword,
        newPassword,
        isLogoutFromAllDevices,
        fingerprint,
      },
    )
      .then(() => {
        commitFromRoot('setNotification', { text: 'Password changed successfully' });
      })
      .catch(error => {
        throw getErrorMessage(error.response.data);
      })
      .finally(() => {
        commitFromRoot('decreaseExplicitRequestsNumber');
      });
  },

  _logOut({ dispatch }, { mode }) {
    const fingerprint = JSON.stringify(getBrowserFingerprint());
    const user = JSON.parse(localStorage.getItem('user'));

    commitFromRoot('increaseExplicitRequestsNumber');

    return this.$config.axios.post(
      `${this.$config.apiBasePath}auth/logout`,
      {
        mode,
        fingerprint,
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
        userId: user.id,
      },
    )
      .then(() => {
        if (mode !== 'allExceptCurrent') {
          dispatch('_logOutLocally');
        } else {
          commitFromRoot('setNotification', { text: 'All other sessions were terminated' });
        }
      })
      .catch(error => {
        throw getErrorMessage(error.response.data);
      })
      .finally(() => {
        commitFromRoot('decreaseExplicitRequestsNumber');
      });
  },

  _logOutLocally({ commit }) {
    commit('logOut');

    localStorage.removeItem('user');
    localStorage.removeItem('currentListId');

    commitFromRoot('sidebar/closeSidebar');
    commitFromRoot('filters/resetFilters');
    commitFromRoot('setCurrentListItems', []);
    commitFromRoot('lists/setCurrentListObj', null);
    commitFromRoot('lists/setCurrentListId', null);
    commitFromRoot('setModalNameToShow', '');
    dispatchFromRoot('cache/_resetCache');
    dispatchFromRoot('visualization/_resetVisualizationToDefault');

    deleteAccessToken();

    router.push({ name: 'signIn' });
  },
  
  _setUserFromLocalStorage({ commit }) {
    const user = localStorage.getItem('user');

    if (user) {
      commit('signIn', JSON.parse(user));
    }
  },

  _setCodeLifetimeInMinutes({ commit }, minutes) {
    commit('setCodeLifetimeInMinutes', minutes);

    sessionStorage.setItem('codeLifetimeInMinutes', minutes);
  },
};
