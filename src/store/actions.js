export default {
  _setState({ commit }, data) {
    commit('setState', data);
  },
  _getInitialData({ dispatch }) {
    if (localStorage.getItem('appLists')) {
      dispatch('_setInitialState', JSON.parse(localStorage.getItem('appLists')));
    } else {
      dispatch('_addList', {
        name: 'default',
        id: null,
        items: [],
        filters: {
          tags: [],
          categories: [],
        },
        checkedFilters: {
          tags: [],
          categories: [],
        },
      });
    }
  },

  // lists

  _setInitialState({ commit }, lists) {
    commit('setInitialState', lists);
  },
  _addList({ commit, dispatch }, list) {
    commit('addList', list);

    dispatch('_updateLocal');
  },
  _removeList({ commit, dispatch, getters }, listId) {
    if (getters.currentListId === listId) {
      const switchListId = getters.lists.length > 1
        ? getters.lists.find(list => list.id !== listId).id
        : null;

      commit('switchList', switchListId);
    }

    commit('removeList', listId);

    dispatch('_updateLocal');
  },
  _filterList({ commit, dispatch, getters }, filters) {
    commit('filterList', {
      currentListIndex: getters.currentListIndex,
      filters,
    });

    dispatch('_updateLocal');
  },
  _switchList({ commit, dispatch }, id) {
    commit('switchList', id);

    dispatch('_updateLocal');
  },
  _shuffleFilteredList({ commit, getters }) {
    commit('shuffleFilteredList', getters.filteredList);
  },
  _switchShuffleMode({ commit }) {
    commit('switchShuffleMode');
  },

  // items

  _addItem({ commit, dispatch, getters }, newItem) {
    commit('addItem', {
      currentListIndex: getters.currentListIndex,
      newItem,
    });
    dispatch('_setChangingStatus', false);
    dispatch('_updateLocal');
  },
  _setItems({ commit, dispatch, getters }, newItems) {
    commit('setItems', {
      currentListIndex: getters.currentListIndex,
      newItems,
    });
    dispatch('_setChangingStatus', false);
    dispatch('_updateLocal');
  },
  _deleteItem({ commit, dispatch, getters }, item) {
    if (item) {
      commit('deleteItem', {
        currentListIndex: getters.currentListIndex,
        id: item.id,
      });
      dispatch('_updateLocal');
    }

    dispatch('_setActiveItem', null);
  },
  _setActiveItem({ commit, dispatch }, item) {
    commit('setActiveItem', item);
    dispatch('_setChangingStatus', true);

    if (!item) {
      dispatch('_setChangingStatus', false);
    }
  },
  _changeItem({ commit, dispatch, getters }, changedItem) {
    commit('changeItem', {
      currentListIndex: getters.currentListIndex,
      changedItem,
    });
    dispatch('_setActiveItem', null);
    dispatch('_updateLocal');
  },
  _startCreatingItem({ dispatch }) {
    dispatch('_setChangingStatus', true);
  },

  // filters

  _addFilter({ commit, dispatch, getters }, { name, type }) {
    if (
      (type === 'tags' || type === 'categories')
      && typeof name === 'string'
      && name.length
    ) {
      commit('addFilter', {
        name,
        type,
        filters: getters.currentListFilters,
      });
    }

    dispatch('_updateLocal');
  },
  _changeFilter({ commit, dispatch, getters }, { type, name, id }) {
    commit('changeFilter', {
      type,
      name,
      id,
      filters: getters.currentListFilters,
    });

    dispatch('_updateLocal');
  },
  _removeFilter({ commit, dispatch, getters }, { type, id }) {
    commit('removeFilter', {
      type,
      id,
      filters: getters.currentListFilters,
    });
    commit('removeFilterFromList', {
      currentListIndex: getters.currentListIndex,
      type,
      id,
    });
    dispatch('_updateLocal');
  },

  // changing statuses

  _changeChangingListStatus({ commit }, status) {
    commit('changeChangingListStatus', status);
  },
  _setChangingStatus({ commit }, isActive) {
    commit('setChangingStatus', isActive);
  },

  // setting actions

  _setSettingsStatus({ commit }, status) {
    commit('setSettingsStatus', status);
  },
  _switchSettingStatus({ state, commit }, field) {
    commit('setSettingsStatus', {
      field,
      value: !state.settingsStatuses[field],
    });
  },

  // visualization modes

  _switchCloudMode({ commit }) {
    commit('switchCloudMode');
  },
  _switchInvertMode({ commit }) {
    commit('switchInvertMode');
  },
  _switchStarsMode({ commit }) {
    commit('switchStarsMode');
  },

  // sidebar

  _openSidebar({ commit }, mode) {
    commit('openSidebar');
    commit('changeSidebarMode', mode);
  },
  _closeSidebar({ commit }) {
    commit('closeSidebar');
    commit('changeSidebarMode', null);
  },

  // local updates

  _updateLocal({ getters }) {
    localStorage.setItem('appLists', JSON.stringify({
      lists: getters.lists,
      currentListId: getters.currentListId,
    }));
  },
};
