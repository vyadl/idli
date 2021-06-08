export default {
  _setState({ commit }, data) {
    commit('setState', data);
  },

  _getInitialData({ dispatch }) {
    if (localStorage.getItem('appLists')) {
      dispatch('_setInitialState', JSON.parse(localStorage.getItem('appLists')));
    } else {
      dispatch('_addList', { name: 'default' });
    }
  },

  // list actions

  _setInitialState({ commit }, payload) {
    commit('setInitialState', payload);
  },

  _addList({ commit, dispatch }, payload) {
    commit('addList', payload);

    dispatch('_updateLocal');
  },

  _removeList({ commit, dispatch, getters }, payload) {
    const switchListId = Object.keys(getters.lists).find(listId => listId !== String(payload));
    commit('switchList', switchListId);
    commit('removeList', payload);

    dispatch('_updateLocal');
  },

  _filterList({ commit, dispatch }, filters) {
    commit('filterList', filters);

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

  _setList({ commit, dispatch, getters }, list) {
    const areMoreNewItems = Object.keys(list).length > Object.keys(getters.list).length;

    if (areMoreNewItems) {
      commit('changeChangingListStatus', true);
    }

    setTimeout(() => {
      setTimeout(() => {
        commit('setList', list);
        dispatch('_updateLocalList');
      }, 5);
    }, 5);
  },

  // filter actions

  _addFilter({ commit, dispatch, getters }, payload) {
    if (
      (payload.type === 'tags' || payload.type === 'types')
      && typeof payload.name === 'string'
      && payload.name.length
    ) {
      commit('addFilter', {
        ...payload,
        filters: getters.filters,
      });
    }

    dispatch('_updateLocal');
  },

  _changeFilter({ commit, dispatch, getters }, payload) {
    commit('changeFilter', {
      ...payload,
      filters: getters.filters,
    });

    dispatch('_updateLocal');
  },

  _removeFilter({ commit, dispatch, getters }, payload) {
    commit('removeFilter', {
      ...payload,
      filters: getters.filters,
    });
    commit('removeFilterFromList', payload);
    dispatch('_updateLocal');
  },

  // item actions

  _addItem({ commit, dispatch }, newItem) {
    commit('addItem', newItem);
    dispatch('_setChangingStatus', false);
    dispatch('_updateLocal');
  },

  _setItems({ commit, dispatch }, newItems) {
    commit('setItems', newItems);
    dispatch('_setChangingStatus', false);
    dispatch('_updateLocal');
  },

  _deleteItem({ commit, dispatch }, item) {
    if (item) {
      commit('deleteItem', item.id);
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

  _changeItem({ commit, dispatch }, changedItem) {
    commit('changeItem', changedItem);
    dispatch('_setActiveItem', null);
    dispatch('_updateLocal');
  },

  _startCreatingItem({ dispatch }) {
    dispatch('_setChangingStatus', true);
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

  // local updates

  _updateLocal({ getters }) {
    localStorage.setItem('appLists', JSON.stringify({
      lists: getters.lists,
      currentListId: getters.currentListId,
    }));
  },
};
