// eslint-disable-next-line import/no-cycle
import { addQueryItems, deleteFromQuery, modifyQuery } from '@/router/utils';
import { queryGroups } from '@/router/config';
import { sidebarModesForViews } from '@/store/config';

export default {
  _openSidebar({ getters, commit }, mode) {
    const {
      allowedSidebarModes,
      default: defaultModeForCurrentView,
    } = sidebarModesForViews[getters.currentSidebarView];

    const isModeAllowed = allowedSidebarModes.includes(mode);
    const finalMode = isModeAllowed ? mode : defaultModeForCurrentView;
    
    commit('openSidebar');
    commit('changeSidebarMode', finalMode);

    if (mode === 'item') {
      addQueryItems({ sidebar: finalMode });
    } else {
      modifyQuery({
        queryToDelete: ['item'],
        queryToAdd: { sidebar: finalMode },
      });
    }
  },

  _closeSidebar({ commit, getters }) {
    commit('closeSidebar');
    deleteFromQuery(queryGroups.sidebar);

    if (getters.sidebarMode === 'item') {
      commit('changeSidebarMode', 'lists');
    }
  },
};
