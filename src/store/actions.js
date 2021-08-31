export default {
  // local storage

  _setListIdFromLocalStorage({ commit, dispatch }) {
    const currentListId = localStorage.getItem('currentListId');

    if (currentListId) {
      commit('setCurrentListId', currentListId);
      dispatch('_fetchListById', { id: currentListId, cancelToken: null });
    }
  },
  _saveSettingsInLocalStorage({ getters }) {
    localStorage.setItem('settings', JSON.stringify(getters.settings));
  },
  _setSettingsFromLocalStorage({ commit }) {
    const settings = localStorage.getItem('settings');

    if (settings) {
      commit('setSettings', JSON.parse(settings));
    }
  },

  // lists

  async _fetchListsForUser({ commit, dispatch }) {
    const { data: responseLists } = await this._vm.$axios.get(`${this._vm.$apiBasePath}lists`);

    commit('setLists', responseLists);
    dispatch('_setListIdFromLocalStorage');
  },
  async _fetchTestLists({ commit }) {
    const { data: responseLists } = await this._vm.$axios.get('/test_data.json');

    commit('setTestLists', responseLists);
  },
  async _fetchListById({ commit, dispatch, getters }, { id, cancelToken }) {
    dispatch('_setCurrentListId', id);

    if (getters.currentListObj?.items.length) {
      if (getters.currentListObj.items[0] instanceof Object) {
        commit('setCurrentItems', getters.currentListObj.items);
      }
    }

    const { data: responseList } = await this._vm.$axios
      .get(`${this._vm.$apiBasePath}list/${id}`, { cancelToken });

    commit('updateList', responseList);
    commit('setCurrentItems', responseList.items);
  },
  async _fetchCurrentItems({ commit, getters }) {
    const { data: responseList } = await this._vm.$axios
      .get(`${this._vm.$apiBasePath}list/${getters.currentListId}`);

    commit('setCurrentItems', responseList.items);
  },
  async _addList({ commit, dispatch }, list) {
    const { data: responseList } = await this._vm.$axios
      .post(`${this._vm.$apiBasePath}list/add`, list);

    commit('addList', responseList);
    dispatch('_setCurrentListId', responseList.id);
  },
  async _addTestList({ commit, dispatch }, {
    title,
    isPrivate,
    tags,
    categories,
    items,
  }) {
    const { data: responseList } = await this._vm.$axios
      .post(`${this._vm.$apiBasePath}list/add`, {
        title,
        isPrivate,
        tags,
        categories,
      });

    commit('addList', responseList);
    dispatch('_setCurrentListId', responseList.id);

    const { data: responseItems } = await this._vm.$axios
      .post(`${this._vm.$apiBasePath}items/add-many/${responseList.id}`, { items });

    commit('addItems', responseItems);
    commit('setCurrentItems', responseItems);
  },
  async _updateList({ commit }, {
    title,
    isPrivate,
    tags,
    categories,
    id,
  }) {
    const { data: responseList } = await this._vm.$axios
      .patch(`${this._vm.$apiBasePath}list/update/${id}`, {
        title,
        isPrivate,
        tags,
        categories,
      });

    commit('updateList', responseList);
    commit('setCurrentItems', responseList.items);
  },
  async _deleteList({ commit, dispatch, getters }, id) {
    await this._vm.$axios.delete(`${this._vm.$apiBasePath}list/delete/${id}`);

    if (getters.currentListObj?.id === id) {
      if (getters.lists.length > 1) {
        const anotherId = getters.lists.find(list => list.id !== id).id;

        dispatch('_fetchListById', { id: anotherId, cancelToken: null });
      } else {
        commit('setCurrentItems', []);
        localStorage.removeItem('currentListId');
      }
    }

    commit('deleteList', id);
    dispatch('_fetchDeletedLists');
  },
  _setCurrentListId({ commit, dispatch, getters }, id) {
    commit('setCurrentListId', id);
    commit('setCurrentItems', []);
    dispatch('_resetFilters');
    localStorage.setItem('currentListId', getters.currentListId);
  },
  _setListForEditting({ commit }, list) {
    commit('setListForEditting', list);
  },
  _filterList({ commit }, { tags, categories }) {
    commit('filterList', { tags, categories });
  },
  _resetFilters({ commit }) {
    commit('resetFilters');
  },

  // items

  async _addItem({ commit, getters }, item) {
    const listId = getters.currentListObj.id;
    const { data: responseItem } = await this._vm.$axios
      .post(`${this._vm.$apiBasePath}item/add/${listId}`, item);

    commit('addItem', responseItem);
  },
  async _updateItem({ commit, dispatch }, {
    title,
    details,
    tags,
    category,
    listId,
    id,
  }) {
    const { data: responseItem } = await this._vm.$axios
      .patch(`${this._vm.$apiBasePath}item/update/${listId}/${id}`, {
        title,
        details,
        tags,
        category,
      });

    commit('updateItem', responseItem);
    dispatch('_setItemForEditting', null);
  },
  async _deleteItem({ commit, dispatch }, item) {
    await this._vm.$axios.delete(`${this._vm.$apiBasePath}item/delete/${item.listId}/${item.id}`);

    commit('deleteItem', item.id);
    dispatch('_setItemForEditting', null);
    dispatch('_fetchDeletedItems');
  },
  _setItemForEditting({ commit }, item) {
    commit('setItemForEditting', item);
  },

  // visualization

  _setSorting({ commit }, sorting) {
    commit('setSorting', sorting);
  },
  _setMode({ commit }, mode) {
    commit('setMode', mode);
  },
  _setTheme({ commit }, theme) {
    commit('setTheme', theme);
  },
  _switchShuffleTrigger({ commit }) {
    commit('switchShuffleTrigger');
  },
  _setListAlign({ commit }, align) {
    commit('setListAlign', align);
  },
  _changeItemDetailsShowingMode({ commit }) {
    commit('changeItemDetailsShowingMode');
  },

  // settings

  _switchItemFormLocation({ commit, dispatch }) {
    commit('switchItemFormLocation');
    dispatch('_saveSettingsInLocalStorage');
  },
  _switchFocusMode({ getters, commit, dispatch }) {
    commit('switchFocusMode');

    if (getters.isFocusOnList) {
      dispatch('_setNotification', { text: 'press Esc to exit focus mode' });
    }

    dispatch('_saveSettingsInLocalStorage');
  },
  _switchSidebarAndListIntersection({ commit }) {
    commit('switchSidebarAndListIntersection');
  },

  // sidebar

  _openSidebar({ commit }, mode) {
    commit('openSidebar');
    commit('changeSidebarMode', mode);
  },
  _closeSidebar({ commit, getters }) {
    commit('closeSidebar');

    if (getters.sidebarMode === 'item') {
      commit('changeSidebarMode', 'lists');
    }
  },

  // notifications

  _setNotification({ commit }, notification) {
    commit('setNotification', notification);
  },

  // modals

  _setmodalNameToShow({ commit }, name) {
    commit('setmodalNameToShow', name);
  },

  // requests

  _decreaseRequestsNumber({ commit }) {
    commit('decreaseRequestsNumber');
  },

  // bin

  async _fetchDeletedLists({ commit }) {
    const { data: deletedLists } = await this._vm.$axios.get(`${this._vm.$apiBasePath}lists/deleted`);

    commit('setDeletedLists', deletedLists);
  },

  async _fetchDeletedItems({ commit }) {
    const { data: deletedItems } = await this._vm.$axios.get(`${this._vm.$apiBasePath}items/deleted`);

    commit('setDeletedItems', deletedItems);
  },

  async _restoreList({ dispatch, getters }, listId) {
    const res = await this._vm.$axios.patch(`${this._vm.$apiBasePath}list/restore/${listId}`);

    await dispatch('_fetchingAfterBinActions', false);

    if (getters.lists.length) {
      dispatch('_fetchCurrentItems');
    }

    return res;
  },

  async _restoreItem({ dispatch }, { listId, itemId }) {
    const res = await this._vm.$axios.patch(`${this._vm.$apiBasePath}item/restore/${listId}/${itemId}`);

    dispatch('_fetchingAfterBinActions', true);

    return res;
  },

  async _hardDeleteList({ dispatch }, listId) {
    await this._vm.$axios.delete(`${this._vm.$apiBasePath}list/hard-delete/${listId}`);

    dispatch('_fetchDeletedLists');
  },

  async _hardDeleteItem({ dispatch }, { listId, itemId }) {
    await this._vm.$axios.delete(`${this._vm.$apiBasePath}item/hard-delete/${listId}/${itemId}`);

    dispatch('_fetchDeletedItems');
  },

  async _hardDeleteAllItems({ dispatch }) {
    await this._vm.$axios.delete(`${this._vm.$apiBasePath}item/hard-delete-all`);

    dispatch('_fetchDeletedItems');
  },

  async _restoreAllItems({ dispatch }) {
    const res = await this._vm.$axios.patch(`${this._vm.$apiBasePath}item/restore-all`);

    dispatch('_fetchingAfterBinActions', true);

    return res;
  },

  async _hardDeleteAllLists({ dispatch }) {
    await this._vm.$axios.delete(`${this._vm.$apiBasePath}list/hard-delete-all`);

    dispatch('_fetchDeletedLists');
  },

  async _restoreAllLists({ dispatch, getters }) {
    const res = await this._vm.$axios.patch(`${this._vm.$apiBasePath}list/restore-all`);

    await dispatch('_fetchingAfterBinActions', false);

    if (getters.currentListObj) {
      dispatch('_fetchCurrentItems');
    }

    return res;
  },

  async _fetchingAfterBinActions({ dispatch }, isItem) {
    if (isItem) {
      dispatch('_fetchCurrentItems');
      dispatch('_fetchDeletedItems');
    } else {
      dispatch('_fetchListsForUser');
      dispatch('_fetchDeletedLists');
    }
  },
};
