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

  async _fetchListsForUser({ commit, dispatch }) {
    const { data: responseLists } = await this._vm.$axios.get(`${this._vm.$apiBasePath}lists`);

    commit('setLists', responseLists);
    dispatch('_setListIdFromLocalStorage');
  },
  async _fetchListById({ commit, dispatch, getters }, id) {
    dispatch('_setCurrentListId', id);

    if (getters.currentListObj.items.length) {
      if (getters.currentListObj.items[0] instanceof Object) {
        dispatch('_setCurrentItems', getters.currentListObj.items);
      }
    }

    const { data: responseList } = await this._vm.$axios.get(`${this._vm.$apiBasePath}list/${id}`);

    commit('updateList', responseList);
    dispatch('_setCurrentItems', responseList.items);
  },
  async _addList({ commit, dispatch }, list) {
    const { data: responseList } = await this._vm.$axios.post(`${this._vm.$apiBasePath}list/add`, list);

    commit('addList', responseList);
    dispatch('_setCurrentListId', responseList.id);
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
  async _updateList({ commit, dispatch }, {
    name,
    isPrivate,
    tags,
    categories,
    id,
  }) {
    const { data: responseList } = await this._vm.$axios
      .patch(`${this._vm.$apiBasePath}list/update/${id}`, {
        name,
        isPrivate,
        tags,
        categories,
      });

    commit('updateList', responseList);
    dispatch('_setCurrentItems', responseList.items);
  },
  async _deleteList({ commit, dispatch, getters }, id) {
    await this._vm.$axios.delete(`${this._vm.$apiBasePath}list/delete/${id}`);

    if (getters.currentListObj.id === id) {
      const anotherid = getters.lists.length > 1
        ? getters.lists.find(list => list.id !== id).id
        : null;

      dispatch('_fetchListById', anotherid);
    }

    commit('deleteList', id);
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

  async _addItem({ commit, getters }, item) {
    const listId = getters.currentListObj.id;
    const { data: responseItem } = await this._vm.$axios
      .post(`${this._vm.$apiBasePath}item/add/${listId}`, item);

    commit('addItem', responseItem);
  },
  async _updateItem({ commit, dispatch }, {
    text,
    details,
    tags,
    category,
    listId,
    id,
  }) {
    const { data: responseItem } = await this._vm.$axios
      .patch(`${this._vm.$apiBasePath}item/update/${listId}/${id}`, {
        text,
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
