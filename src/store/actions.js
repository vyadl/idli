// eslint-disable-next-line import/no-cycle
import { deleteFromQuery, changeQuery } from '@/router/utils';

const UNITS_AND_STORE_NAMES_ACCORDANCE = {
  settings: {
    getter: 'settings/settings',
    mutation: 'settings/setSettings',
  },
};

export default {
  // local storage
  
  _saveUnitInLocalStorage({ getters }, unitName) {
    if (!getters['lists/isPublicView']) {
      localStorage.setItem(
        unitName, 
        JSON.stringify(getters[UNITS_AND_STORE_NAMES_ACCORDANCE[unitName].getter]),
      );
    }
  },

  _setUnitsFromLocalStorage({ commit }, units) {
    units.forEach(unit => {
      const value = localStorage.getItem(unit);

      if (value) {
        commit(UNITS_AND_STORE_NAMES_ACCORDANCE[unit].mutation, JSON.parse(value));
      }
    });
  },

  // draggable view

  _enterDraggableMode({ commit, dispatch }) {
    commit('setIsDraggableMode', true);
    dispatch('_resetCustomView');
  },

  _exitDraggableMode({ commit }) {
    commit('setIsDraggableMode', false);
  },

  _toggleDraggableMode({ getters, dispatch }) {
    dispatch(getters.isDraggableMode
      ? '_exitDraggableMode'
      : '_enterDraggableMode');
  },

  // reset views

  _resetCustomView({ commit, dispatch }) {
    commit('filters/resetFilters');
    dispatch('visualization/_resetVisualizationToDefault');
    deleteFromQuery([
      'sorting',
      'mode',
      'submode',
      'reverse-order',
      'with-details',
      'search',
      'tags',
      'categories',
    ]);
  },
};
