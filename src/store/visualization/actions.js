// eslint-disable-next-line import/no-cycle
import { deleteFromQuery, changeQueryRespectingDefault } from '@/router/utils';
import { queryGroups } from '@/router/config';
import { dispatchFromRoot } from '@/store/utils';

export default {
  _setSorting({ state, commit, dispatch }, sorting) {
    commit('setSorting', sorting);
    changeQueryRespectingDefault({ option: 'sorting', value: sorting });

    if (sorting === 'shuffled') {
      if (state.visualization.isItemsOrderReversed) {
        dispatch('_toggleItemsOrder');
      }
    }
  },
  _setMode({ commit }, mode) {
    commit('setMode', mode);
    changeQueryRespectingDefault({ option: 'mode', value: mode });
  },
  _setListAlign({ commit }, align) {
    commit('setListAlign', align);
    changeQueryRespectingDefault({ option: 'align', value: align });
  },
  _toggleItemsOrder({ getters, commit }) {
    dispatchFromRoot('_exitDraggableMode');
    commit('toggleItemsOrder');
    changeQueryRespectingDefault({ option: 'isItemsOrderReversed', value: getters.isItemsOrderReversed });
  },
  _toggleItemDetailsShowingMode({ getters, commit }) {
    commit('toggleItemDetailsShowingMode');
    changeQueryRespectingDefault({ option: 'areItemDetailsShown', value: getters.areItemDetailsShown });
  },
  _resetVisualizationToDefault({ commit }) {
    commit('resetVisualizationToDefault');
    deleteFromQuery(queryGroups.visualization);
  },
};
