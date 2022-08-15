// eslint-disable-next-line import/no-cycle
import { addQueryItems, changeRoute, deleteQueryItems } from '@/router/index';

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

  _fetchListsForUser({ commit, dispatch }) {
    return this.$config.axios.get(`${this.$config.apiBasePath}lists`)
      .then(({ data: responseLists }) => {
        commit('setLists', responseLists);
        dispatch('_setListIdFromLocalStorage');
      });
  },
  _fetchTestLists({ commit }) {
    return this.$config.axios.get('/test_data.json')
      .then(({ data: responseLists }) => {
        commit('setTestLists', responseLists);
      });
  },
  _fetchListById({ commit, dispatch, getters }, { id, cancelToken }) {
    dispatch('_setCurrentListId', id);

    if (getters.currentListObj?.items.length) {
      if (getters.currentListObj.items[0] instanceof Object) {
        commit('setCurrentItems', getters.currentListObj.items);
      }
    }

    return this.$config.axios
      .get(`${this.$config.apiBasePath}list/${id}`, { cancelToken })
      .then(({ data: responseList }) => {
        commit('updateList', responseList);
        commit('setCurrentItems', responseList.items);
        changeRoute('list', { id });
      })
      .catch(error => {
        console.log(error);
      });
  },
  _fetchCurrentItems({ commit, getters }) {
    return this.$config.axios
      .get(`${this.$config.apiBasePath}list/${getters.currentListId}`)
      .then(({ data: responseList }) => {
        commit('setCurrentItems', responseList.items);
      });
  },
  _addList({ commit, dispatch }, list) {
    return this.$config.axios
      .post(`${this.$config.apiBasePath}list/add`, list)
      .then(({ data: responseList }) => {
        commit('addList', responseList);
        dispatch('_setCurrentListId', responseList.id);
      });
  },
  async _addTestList({ commit, dispatch }, {
    title,
    isPrivate,
    tags,
    categories,
    items,
  }) {
    const { data: responseList } = await this.$config.axios
      .post(`${this.$config.apiBasePath}list/add`, {
        title,
        isPrivate,
        tags,
        categories,
      });

    commit('addList', responseList);
    dispatch('_setCurrentListId', responseList.id);

    const { data: responseItems } = await this.$config.axios
      .post(`${this.$config.apiBasePath}items/add-many/${responseList.id}`, { items });

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
    const { data: responseList } = await this.$config.axios
      .patch(`${this.$config.apiBasePath}list/update/${id}`, {
        title,
        isPrivate,
        tags,
        categories,
      });

    commit('updateList', responseList);
    commit('setCurrentItems', responseList.items);
  },
  async _deleteList({ commit, dispatch, getters }, id) {
    await this.$config.axios.delete(`${this.$config.apiBasePath}list/delete/${id}`);

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
    const { data: responseItem } = await this.$config.axios
      .post(`${this.$config.apiBasePath}item/add/${listId}`, item);

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
    const { data: responseItem } = await this.$config.axios
      .patch(`${this.$config.apiBasePath}item/update/${listId}/${id}`, {
        title,
        details,
        tags,
        category,
      });

    commit('updateItem', responseItem);
    dispatch('_setItemForEditting', null);
  },
  async _deleteItem({ commit, dispatch }, item) {
    await this.$config.axios.delete(`${this.$config.apiBasePath}item/delete/${item.listId}/${item.id}`);

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
  _switchSidebarAndListIntersection({ commit, dispatch }) {
    commit('switchSidebarAndListIntersection');
    dispatch('_saveSettingsInLocalStorage');
  },
  _switchUsingHotkeys({ commit, dispatch }) {
    commit('switchUsingHotkeys');
    dispatch('_saveSettingsInLocalStorage');
  },

  // sidebar

  _openSidebar({ commit }, mode) {
    commit('openSidebar');
    commit('changeSidebarMode', mode);
    addQueryItems({ sidebar: mode });
  },
  _closeSidebar({ commit, getters }) {
    commit('closeSidebar');
    deleteQueryItems('sidebar');

    if (getters.sidebarMode === 'item') {
      commit('changeSidebarMode', 'lists');
    }
  },

  // notifications

  _setNotification({ commit }, notification) {
    commit('setNotification', notification);
  },

  // modals

  _setModalNameToShow({ commit }, name) {
    commit('setmodalNameToShow', name);
  },

  // requests

  _decreaseRequestsNumber({ commit }) {
    commit('decreaseRequestsNumber');
  },

  // bin

  async _fetchDeletedLists({ commit }) {
    const { data: deletedLists } = await this.$config.axios.get(`${this.$config.apiBasePath}lists/deleted`);

    commit('setDeletedLists', deletedLists);
  },

  async _fetchDeletedItems({ commit }) {
    const { data: deletedItems } = await this.$config.axios.get(`${this.$config.apiBasePath}items/deleted`);

    commit('setDeletedItems', deletedItems);
  },

  async _restoreList({ dispatch, getters }, listId) {
    const res = await this.$config.axios.patch(`${this.$config.apiBasePath}list/restore/${listId}`);

    await dispatch('_fetchingAfterBinActions', false);

    if (getters.lists.length) {
      dispatch('_fetchCurrentItems');
    }

    return res;
  },

  async _restoreItem({ dispatch }, { listId, itemId }) {
    const res = await this.$config.axios.patch(`${this.$config.apiBasePath}item/restore/${listId}/${itemId}`);

    dispatch('_fetchingAfterBinActions', true);

    return res;
  },

  async _hardDeleteList({ dispatch }, listId) {
    await this.$config.axios.delete(`${this.$config.apiBasePath}list/hard-delete/${listId}`);

    dispatch('_fetchDeletedLists');
  },

  async _hardDeleteItem({ dispatch }, { listId, itemId }) {
    await this.$config.axios.delete(`${this.$config.apiBasePath}item/hard-delete/${listId}/${itemId}`);

    dispatch('_fetchDeletedItems');
  },

  async _hardDeleteAllItems({ dispatch }) {
    await this.$config.axios.delete(`${this.$config.apiBasePath}item/hard-delete-all`);

    dispatch('_fetchDeletedItems');
  },

  async _restoreAllItems({ dispatch }) {
    const res = await this.$config.axios.patch(`${this.$config.apiBasePath}item/restore-all`);

    dispatch('_fetchingAfterBinActions', true);

    return res;
  },

  async _hardDeleteAllLists({ dispatch }) {
    await this.$config.axios.delete(`${this.$config.apiBasePath}list/hard-delete-all`);

    dispatch('_fetchDeletedLists');
  },

  async _restoreAllLists({ dispatch, getters }) {
    const res = await this.$config.axios.patch(`${this.$config.apiBasePath}list/restore-all`);

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
