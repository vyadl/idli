// eslint-disable-next-line import/no-cycle
import { deleteFromQuery, changeQueryRespectingDefault } from '@/router/utils';
import { queryGroups } from '@/router/config';
import { dispatchFromRoot } from '@/store/utils';

export default {
  _setSorting({ state, commit, dispatch }, sorting) {
    commit('setSorting', sorting);
    changeQueryRespectingDefault('sorting', sorting);

    if (sorting === 'shuffled') {
      if (state.visualization.isItemsOrderReversed) {
        dispatch('_toggleItemsOrder');
      }
    }
  },
  _setMode({ commit }, mode) {
    commit('setMode', mode);
    changeQueryRespectingDefault('mode', mode);
  },
  _setListAlign({ commit }, align) {
    commit('setListAlign', align);
    changeQueryRespectingDefault('align', align);
  },
  _toggleItemsOrder({ getters, commit }) {
    dispatchFromRoot('_exitDraggableMode');
    commit('toggleItemsOrder');
    changeQueryRespectingDefault('isItemsOrderReversed', getters.isItemsOrderReversed);
  },
  _toggleItemDetailsShowingMode({ getters, commit }) {
    commit('toggleItemDetailsShowingMode');
    changeQueryRespectingDefault('areItemDetailsShown', getters.areItemDetailsShown);
  },
  _resetVisualizationToDefault({ commit }) {
    commit('resetVisualizationToDefault');
    deleteFromQuery(queryGroups.visualization);
  },
};
