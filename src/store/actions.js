export default {
// back

  _fetchListsForUser({ commit }) {
    return this._vm.$axios.get(`${this._vm.$apiBasePath}lists`)
      .then(response => { commit('setLists', response.data); })
      .catch(error => { throw error; });
  },

  _fetchListById({ commit }, id) {
    return this._vm.$axios.get(`${this._vm.$apiBasePath}lists/${id}`)
      .then(response => { commit('setCurrentListObj', response.data); })
      .catch(error => { throw error; });
  },

  _addList({ commit, dispatch }, list) {
    return this._vm.$axios.post(`${this._vm.$apiBasePath}list/add`, list)
      .then(response => {
        echo(1);
        commit('addList', response.data);
        commit('setCurrentListObj', response.data);
        dispatch('_updateLocal');
      })
      .catch(error => { throw error; });
  },

  // local storage

  _setDataFromLocalStorage({ commit }) {
    const currentListId = localStorage.getItem('currentListId');

    if (currentListId) {
      commit('setCurrentListId', JSON.parse(currentListId));
    }
  },
  _updateLocal({ getters }) {
    localStorage.setItem('currentListId', JSON.stringify({
      currentListId: getters.currentListId,
    }));
  },

  // lists

  _saveList({ commit, dispatch }, list) {
    commit('saveList', list);

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
  _setListForEditting({ commit }, id) {
    commit('setListForEditting', id);
  },
  _filterList({ commit, dispatch }, { tags, categories }) {
    commit('filterList', { tags, categories });

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
    dispatch('_updateLocal');
  },
  _setItems({ commit, dispatch, getters }, newItems) {
    commit('setItems', {
      currentListIndex: getters.currentListIndex,
      newItems,
    });
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

    dispatch('_setItemForEditting', null);
  },
  _setItemForEditting({ commit }, item) {
    commit('setItemForEditting', item);
  },
  _changeItem({ commit, dispatch, getters }, changedItem) {
    commit('changeItem', {
      currentListIndex: getters.currentListIndex,
      changedItem,
    });
    dispatch('_setItemForEditting', null);
    dispatch('_updateLocal');
  },

  // filters

  _addFilter({ commit, dispatch, getters }, { type, name }) {
    if (
      (['tags', 'categories'].includes(type))
      && typeof name === 'string'
      && name.length
    ) {
      commit('addFilter', {
        currentListIndex: getters.currentListIndex,
        type,
        name,
      });
    }

    dispatch('_updateLocal');
  },
  _changeFilter({ commit, dispatch, getters }, { type, name, id }) {
    commit('changeFilter', {
      currentListIndex: getters.currentListIndex,
      type,
      name,
      id,
    });

    dispatch('_updateLocal');
  },
  _removeFilter({ commit, dispatch, getters }, { type, id }) {
    commit('removeFilter', {
      currentListIndex: getters.currentListIndex,
      type,
      id,
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
};
