export default {
  // local storage

  _setListIdFromLocalStorage({ commit, dispatch }) {
    const currentListId = localStorage.getItem('currentListId');

    if (currentListId) {
      commit('setCurrentListId', currentListId);
      dispatch('_fetchListById', currentListId);
    }
  },
  _updateListIdInLocalStorage({ getters }) {
    localStorage.setItem('currentListId', getters.currentListId);
  },

  // lists

  _fetchListsForUser({ commit, dispatch }) {
    return this._vm.$axios.get(`${this._vm.$apiBasePath}lists`)
      .then(response => {
        commit('setLists', response.data);
        dispatch('_setListIdFromLocalStorage');
      })
      .catch(error => {
        throw error;
      });
  },
  _fetchListById({ commit, dispatch, getters }, id) {
    dispatch('_setCurrentListId', id);

    if (getters.currentListObj.items.length) {
      if (typeof getters.currentListObj.items[0] === 'object') {
        dispatch('_setCurrentItems', getters.currentListObj.items);
      }
    }

    return this._vm.$axios.get(`${this._vm.$apiBasePath}list/${id}`)
      .then(response => {
        commit('updateList', response.data);
        dispatch('_setCurrentItems', response.data.items);
      })
      .catch(error => {
        throw error;
      });
  },
  _addList({ commit, dispatch }, list) {
    return this._vm.$axios.post(`${this._vm.$apiBasePath}list/add`, list)
      .then(response => {
        commit('addList', response.data);
        dispatch('_setCurrentListId', response.data.id);
      })
      .catch(error => {
        throw error;
      });
  },
  async _addTestList({ commit, dispatch }, {
    name,
    isPrivate,
    tags,
    categories,
    items,
  }) {
    const { data: responseList } = await this._vm.$axios
      .post(`${this._vm.$apiBasePath}list/add`, {
        name,
        isPrivate,
        tags,
        categories,
      });

    commit('addList', responseList);
    dispatch('_setCurrentListId', responseList.id);

    const { data: responseItems } = await this._vm.$axios
      .post(`${this._vm.$apiBasePath}items/add-many/${responseList.id}`, { items });

    commit('addItems', responseItems);
    dispatch('_setCurrentItems', responseItems);
  },
  _updateList({ commit, dispatch }, {
    name,
    isPrivate,
    tags,
    categories,
    id,
  }) {
    return this._vm.$axios.patch(`${this._vm.$apiBasePath}list/update/${id}`, {
      name,
      isPrivate,
      tags,
      categories,
    })
      .then(response => {
        commit('updateList', response.data);
        dispatch('_setCurrentItems', response.data.items);
      })
      .catch(error => {
        throw error;
      });
  },
  _deleteList({ commit, dispatch, getters }, listId) {
    return this._vm.$axios.delete(`${this._vm.$apiBasePath}list/delete/${listId}`)
      .then(() => {
        if (getters.currentListObj.id === listId) {
          const anotherListId = getters.lists.length > 1
            ? getters.lists.find(list => list.id !== listId).id
            : null;

          dispatch('_fetchListById', anotherListId);
        }

        commit('deleteList', listId);
      })
      .catch(error => {
        throw error;
      });
  },

  _setCurrentListId({ commit, dispatch }, id) {
    commit('setCurrentListId', id);
    dispatch('_setCurrentItems', []);
    dispatch('_updateListIdInLocalStorage');
  },
  _setListForEditting({ commit }, list) {
    commit('setListForEditting', list);
  },
  _filterList({ commit }, { tags, categories }) {
    commit('filterList', { tags, categories });
  },
  _shuffleFilteredList({ commit, getters }) {
    commit('shuffleFilteredList', getters.filteredList);
  },
  _switchShuffleMode({ commit }) {
    commit('switchShuffleMode');
  },

  // items

  _addItem({ commit, getters }, item) {
    const listId = getters.currentListObj.id;

    return this._vm.$axios.post(`${this._vm.$apiBasePath}item/add/${listId}`, item)
      .then(response => {
        commit('addItem', response.data);
      })
      .catch(error => {
        throw error;
      });
  },
  _updateItem({ commit, dispatch }, {
    text,
    details,
    tags,
    category,
    listId,
    id,
  }) {
    return this._vm.$axios.patch(`${this._vm.$apiBasePath}item/update/${listId}/${id}`, {
      text,
      details,
      tags,
      category,
    })
      .then(response => {
        commit('updateItem', response.data);
        dispatch('_setItemForEditting', null);
      })
      .catch(error => {
        throw error;
      });
  },
  _deleteItem({ commit, dispatch }, item) {
    return this._vm.$axios.delete(`${this._vm.$apiBasePath}item/delete/${item.listId}/${item.id}`)
      .then(() => {
        commit('deleteItem', item.id);
        dispatch('_setItemForEditting', null);
      })
      .catch(error => {
        throw error;
      });
  },
  _setCurrentItems({ commit }, items) {
    commit('setCurrentItems', items);
  },
  _setItemForEditting({ commit }, item) {
    commit('setItemForEditting', item);
  },

  // changing statuses

  _changeChangingListStatus({ commit }, status) {
    commit('changeChangingListStatus', status);
  },

  // visualization modes

  _switchInvertMode({ commit }) {
    commit('switchInvertMode');
  },
  _switchCloudMode({ commit }) {
    commit('switchCloudMode');
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
