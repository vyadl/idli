export default {
  _setHotkeys({ dispatch, getters }) {
    document.addEventListener('keydown', event => {
      if (event.code === 'Escape' && getters.settings.isFocusOnList) {
        dispatch('_switchFocusMode');
      }
    });
  },

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

    if (getters.currentListObj.id === id) {
      if (getters.lists.length > 1) {
        const anotherId = getters.lists.find(list => list.id !== id).id;

        dispatch('_fetchListById', { id: anotherId, cancelToken: null });
      } else {
        commit('setCurrentItems', []);
        localStorage.removeItem('currentListId');
      }
    }

    commit('deleteList', id);
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
  },
  _setItemForEditting({ commit }, item) {
    commit('setItemForEditting', item);
  },

  // visualization

  _setSorting({ commit }, sorting) {
    commit('setSorting', sorting);

    if (sorting === 'default') {
      commit('setMode', 'list');
    }
  },
  _setMode({ commit }, mode) {
    commit('setMode', mode);
    commit('setSorting', ['cloud', 'stars'].includes(mode) ? 'shuffled' : 'default');
  },
  _setTheme({ commit }, theme) {
    commit('setTheme', theme);
  },
  _shuffleFilteredList({ commit }) {
    commit('shuffleFilteredList');
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
  _switchFocusMode({ commit, dispatch }) {
    commit('switchFocusMode');
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

  _setNotification({ commit }, text) {
    commit('setNotification', text);
  },

  // requests

  _decreaseRequestsNumber({ commit }) {
    commit('decreaseRequestsNumber');
  },
};
