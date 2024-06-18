// eslint-disable-next-line import/no-cycle
import { deleteFromQuery } from '@/router/utils';
import { queryGroups } from '@/router/config';
import { notifyAboutError } from '@/store/utils';
import { getErrorMessage } from '@/backendInteraction/serverErrors';

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

  // search vault

  _searchInVault({ commit, dispatch }, value) {   
    commit('lists/setCurrentListId', null);
    commit('increaseExplicitRequestsNumber');

    return this.$config.axios
      .get(
        `${this.$config.apiBasePath}search/${value}`,
      )
      .then(({ data: responseList }) => {
        commit('setSearchResults', responseList);

        return responseList;
      })
      .catch(error => {
        notifyAboutError(error);
        dispatch('_fetchListsForUser');

        throw getErrorMessage(error.response.data);
      })
      .finally(() => {
        commit('decreaseExplicitRequestsNumber');
      });
  },

  // reset views

  _resetCustomView({ commit }) {
    commit('filters/resetFilters');
    commit('visualization/resetVisualizationToDefault');
    deleteFromQuery([
      ...queryGroups.filters,
      ...queryGroups.visualization,
    ]);
  },

  // view acoording things

  _globalBlockSelecting({ commit }) {
    commit('setBlockGlobalSelecting', true)
  },
  _globalAllowSelecting({ commit }) {
    commit('setBlockGlobalSelecting', false)
  },
};
