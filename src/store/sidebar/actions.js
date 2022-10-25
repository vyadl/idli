import { addQueryItems, deleteFromQuery } from '@/router/utils';

export default {
  _openSidebar({ commit }, mode) {
    commit('openSidebar');
    commit('changeSidebarMode', mode);
    addQueryItems({ sidebar: mode });
  },

  _closeSidebar({ commit, getters }) {
    commit('closeSidebar');
    deleteFromQuery('sidebar');

    if (getters.sidebarMode === 'item') {
      commit('changeSidebarMode', 'lists');
    }
  },
};
