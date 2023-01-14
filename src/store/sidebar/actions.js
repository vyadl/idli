// eslint-disable-next-line import/no-cycle
import { addQueryItems, deleteFromQuery } from '@/router/utils';
import { sidebarModesForViews } from '@/store/config';

export default {
  _openSidebar({ getters, commit }, mode) {
    const {
      allowedSidebarModes,
      default: defaultModeForCurrentView,
    } = sidebarModesForViews[getters.currentSidebarView];

    const isModeAllowed = allowedSidebarModes.includes(mode);
    
    commit('openSidebar');
    commit('changeSidebarMode', isModeAllowed ? mode : defaultModeForCurrentView);
    addQueryItems({ sidebar: isModeAllowed ? mode : defaultModeForCurrentView });
  },

  _closeSidebar({ commit, getters }) {
    commit('closeSidebar');
    deleteFromQuery('sidebar');

    if (getters.sidebarMode === 'item') {
      commit('changeSidebarMode', 'lists');
    }
  },
};
