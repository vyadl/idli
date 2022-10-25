import { commitFromRoot, dispatchFromRoot } from '@/store/utils'; // eslint-disable-line import/no-cycle

export default {
  _toggleItemFormLocation({ commit }) {
    commit('toggleItemFormLocation');
    dispatchFromRoot('_saveUnitInLocalStorage', 'settings');
  },
  _toggleFocusMode({ getters, commit }) {
    commit('toggleFocusMode');

    if (getters.isFocusOnList) {
      commitFromRoot('setNotification', { text: 'press Esc to exit focus mode' });
    }

    dispatchFromRoot('_saveUnitInLocalStorage', 'settings');
  },
  _toggleSidebarAndListIntersection({ commit }) {
    commit('toggleSidebarAndListIntersection');
    dispatchFromRoot('_saveUnitInLocalStorage', 'settings');
  },
  _toggleUsingHotkeys({ commit }) {
    commit('toggleUsingHotkeys');
    dispatchFromRoot('_saveUnitInLocalStorage', 'settings');
  },
  _setTheme({ commit }, theme) {
    commit('setTheme', theme);
    dispatchFromRoot('_saveUnitInLocalStorage', 'settings');
  },
};
