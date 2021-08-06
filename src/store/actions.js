export default {
  // local storage

  _setDataFromLocalStorage({ commit }) {
    const currentListObj = localStorage.getItem('currentListObj');

    if (currentListObj) {
      commit('currentListObj', JSON.parse(currentListObj));
    }
  },
  _updateLocal({ getters }) {
    localStorage.setItem('currentListObj', JSON.stringify({
      currentListObj: getters.currentListObj,
    }));
  },

  // lists (back)

  _fetchListsForUser({ commit }) {
    return this._vm.$axios.get(`${this._vm.$apiBasePath}lists`)
      .then(response => { commit('setLists', response.data); })
      .catch(error => { throw error; });
  },
  _fetchListById({ commit }, id) {
    return this._vm.$axios.get(`${this._vm.$apiBasePath}lists/${id}`)
      .then(response => {
        commit('setCurrentListObj', response.data);

        return response;
      })
      .catch(error => { throw error; });
  },
  _addList({ commit, dispatch }, list) {
    return this._vm.$axios.post(`${this._vm.$apiBasePath}list/add`, list)
      .then(response => {
        commit('addList', response.data);
        commit('setCurrentListObj', response.data);
        dispatch('_updateLocal');
      })
      .catch(error => { throw error; });
  },
  _updateList({ commit }, list) {
    const {
      name,
      isPrivate,
      tags,
      categories,
    } = list;

    return this._vm.$axios.patch(`${this._vm.$apiBasePath}list/update/${list.id}`, {
      name,
      isPrivate,
      tags,
      categories,
    }).then(response => { commit('updateList', response.data); })
      .catch(error => { throw error; });
  },
  _deleteList({ commit, getters }, listId) {
    return this._vm.$axios.delete(`${this._vm.$apiBasePath}list/delete/${listId}`)
      .then(() => {
        if (getters.currentListObj.id === listId) {
          const switchListId = getters.lists.length > 1
            ? getters.lists.find(list => list.id !== listId).id
            : null;

          commit('switchList', switchListId);
        }

        commit('deleteList', listId);
      })
      .catch(error => { throw error; });
  },

  // lists

  _setListForEditting({ commit }, id) {
    commit('setListForEditting', id);
  },
  _filterList({ commit, dispatch }, { tags, categories }) {
    commit('filterList', { tags, categories });

    dispatch('_updateLocal');
  },
  _switchList({ commit, dispatch }, list) {
    commit('switchList', list);

    dispatch('_updateLocal');
  },
  _shuffleFilteredList({ commit, getters }) {
    commit('shuffleFilteredList', getters.filteredList);
  },
  _switchShuffleMode({ commit }) {
    commit('switchShuffleMode');
  },

  // items (back)

  _addItem({ commit, getters }, item) {
    const listId = getters.currentListObj.id;

    return this._vm.$axios.post(`${this._vm.$apiBasePath}item/add${listId}`, item)
      .then(response => {
        commit('addItem', {
          currentListIndex: getters.currentListIndex,
          item: response.data,
        });
      })
      .catch(error => { throw error; });
  },
  _updateItem({ commit, dispatch, getters }, item) {
    const listId = getters.currentListObj.id;
    const {
      text,
      details,
      tags,
      category,
    } = item;

    return this._vm.$axios.patch(`${this._vm.$apiBasePath}item/update/${listId}/${item.id}`, {
      text,
      details,
      tags,
      category,
    }).then(response => {
      commit('updateItem', {
        currentListIndex: getters.currentListIndex,
        item: response.data,
      });
      dispatch('_setItemForEditting', null);
    })
      .catch(error => { throw error; });
  },
  _deleteItem({ commit, dispatch, getters }, item) {
    const listId = getters.currentListObj.id;

    return this._vm.$axios.delete(`${this._vm.$apiBasePath$}item/delete/${listId}/${item.id}`)
      .then(() => {
        commit('deleteItem', {
          currentListIndex: getters.currentListIndex,
          id: item.id,
        });

        dispatch('_setItemForEditting', null);
      })
      .catch(error => { throw error; });
  },

  // items

  _setItems({ commit, dispatch, getters }, newItems) {
    commit('setItems', {
      currentListIndex: getters.currentListIndex,
      newItems,
    });
    dispatch('_updateLocal');
  },
  _setItemForEditting({ commit }, item) {
    commit('setItemForEditting', item);
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
