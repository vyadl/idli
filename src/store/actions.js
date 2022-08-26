// eslint-disable-next-line import/no-cycle
import { 
  addQueryItems,
  pushRouteKeepQuery,
  deleteFromQuery,
  changeQuery,
  changeQueryRespectingDefault,
} from '@/router/utils';
// eslint-disable-next-line import/no-cycle
import { notifyAboutError } from '@/store/store-utils';
// eslint-disable-next-line import/no-cycle
import { router } from '@/router';
import { MIN_SEARCH_SYMBOLS } from '../../config';

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

        const routerValues = router.currentRoute._value;

        if (routerValues.name !== 'item' && !routerValues.params.id) {
          dispatch('_setListIdFromLocalStorage');
        }
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

    if (getters.currentListObj?.items?.length) {
      if (getters.currentListObj.items[0] instanceof Object) {
        commit('setCurrentItems', getters.currentListObj.items);
      }
    }

    return this.$config.axios
      .get(`${this.$config.apiBasePath}list/${id}`, { cancelToken })
      .then(({ data: responseList }) => {
        commit('updateList', responseList);
        commit('setCurrentItems', responseList.items);
      })
      .catch(error => {
        notifyAboutError(error.response.status, error.response.data.message);
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
    pushRouteKeepQuery({
      name: 'list',
      params: { id: responseList.id },
    });

    const { data: responseItems } = await this.$config.axios
      .post(`${this.$config.apiBasePath}items/add-many/${responseList.id}`, { items });

    commit('addItems', responseItems);
    commit('setCurrentItems', responseItems);
  },
  _updateList({ commit, dispatch }, {
    title,
    isPrivate,
    tags,
    categories,
    id,
  }) {
    commit('updateList', {
      title,
      isPrivate,
      tags,
      categories,
      id,
    });

    this.$config.axios
      .patch(`${this.$config.apiBasePath}list/update/${id}`, {
        title,
        isPrivate,
        tags,
        categories,
      })
      .then(({ data: responseList }) => {
        commit('updateList', responseList);
      })
      .catch(error => {
        notifyAboutError(error.response.status, error.response.data.message);
        dispatch('_fetchListsForUser');
      });
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
  _setCurrentListId({ commit, getters }, id) {
    commit('setCurrentListId', id);
    commit('setCurrentItems', []);
    localStorage.setItem('currentListId', getters.currentListId);
    pushRouteKeepQuery({
      name: 'list',
      params: { id },
    });
  },
  _setListForEditting({ commit }, list) {
    commit('setListForEditting', list);
  },

  // items

  _fetchItemById() {
    return this.$config.axios
      .get(
        `${this.$config.apiBasePath}item/${router.currentRoute._value.params.id}`,
        { cancelToken: null },
      )
      .then(({ data }) => data)
      .catch(error => {
        console.log(error);
      });
  },
  async _addItem({ commit, dispatch, getters }, item) {
    const listId = getters.currentListObj.id;
    const itemWithTemporaryId = {
      ...item,
      temporaryId: Date.now(),
    };

    commit('addItem', itemWithTemporaryId);
    this.$config.axios
      .post(`${this.$config.apiBasePath}item/add/${listId}`, itemWithTemporaryId)
      .then(({ data: responseItem }) => {
        commit('updateItemByTemporaryId', responseItem);
      })
      .catch(error => {
        notifyAboutError(error.response.status, error.response.data.message);
        dispatch('_fetchListById', { id: listId, cancelToken: null });
      });
  },
  _updateItem({ commit, dispatch }, {
    title,
    details,
    tags,
    category,
    listId,
    id,
  }) {
    commit('updateItem', {
      title,
      details,
      tags,
      category,
      id,
    });

    dispatch('_setItemForEditting', null);

    this.$config.axios
      .patch(`${this.$config.apiBasePath}item/update/${listId}/${id}`, {
        title,
        details,
        tags,
        category,
      })
      .then(({ data: responseList }) => {
        commit('updateItem', responseList);
      })
      .catch(error => {
        notifyAboutError(error.response.status, error.response.data.message);
        dispatch('_fetchListById', { id: listId, cancelToken: null });
      });
  },
  async _deleteItem({ commit, dispatch }, item) {
    commit('deleteItem', item.id);
    dispatch('_setItemForEditting', null);
    
    this.$config.axios.delete(`${this.$config.apiBasePath}item/delete/${item.listId}/${item.id}`)
      .then(() => {
        dispatch('_fetchDeletedItems');
      })
      .catch(async error => {
        notifyAboutError(error.response.status, error.response.data.message);
        await dispatch('_fetchListById', { id: item.listId, cancelToken: null });
        dispatch('_setItemForEditting', item);
      });
  },
  _setItemForEditting({ commit }, item) {
    commit('setItemForEditting', item);
  },

  // filters

  _setCurrentSearchValue({ commit }, search) {
    commit('setCurrentSearchValue', search);

    changeQuery(
      'search', 
      search.length >= MIN_SEARCH_SYMBOLS ? search : null,
    );
  },
  _setTags({ commit }, tags) {
    commit('setTags', tags);
    changeQueryRespectingDefault('tags', JSON.stringify(tags));
  },
  _setCategories({ commit }, categories) {
    commit('setCategories', categories);
    changeQueryRespectingDefault('categories', JSON.stringify(categories));
  },
  _resetFilters({ commit }) {
    commit('resetFilters');
    deleteFromQuery(['search', 'tags', 'categories']);
  },

  // visualization

  _setSorting({ state, commit, dispatch }, sorting) {
    commit('setSorting', sorting);
    changeQueryRespectingDefault('sorting', sorting);

    if (sorting === 'shuffled') {
      if (state.visualization.isItemsOrderReversed) {
        dispatch('_toggleItemsOrder');
      }
    }
  },
  _setMode({ commit }, mode) {
    commit('setMode', mode);
    changeQueryRespectingDefault('mode', mode);
  },
  _setTheme({ commit }, theme) {
    commit('setTheme', theme);
    changeQueryRespectingDefault('theme', theme);
  },
  _switchShuffleTrigger({ commit }) {
    commit('switchShuffleTrigger');
  },
  _setListAlign({ commit }, align) {
    commit('setListAlign', align);
    changeQueryRespectingDefault('align', align);
  },
  _toggleItemsOrder({ state, commit }) {
    commit('toggleItemsOrder');
    changeQueryRespectingDefault('isItemsOrderReversed', state.visualization.isItemsOrderReversed);
  },
  _toggleItemDetailsShowingMode({ state, commit }) {
    commit('toggleItemDetailsShowingMode');
    changeQueryRespectingDefault('areItemDetailsShown', state.visualization.areItemDetailsShown);
  },

  // settings

  _switchItemFormLocation({ commit, dispatch }) {
    commit('switchItemFormLocation');
    dispatch('_saveSettingsInLocalStorage');
  },
  _switchFocusMode({ getters, commit, dispatch }) {
    commit('switchFocusMode');

    if (getters.isFocusOnList) {
      commit('setNotification', { text: 'press Esc to exit focus mode' });
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
    deleteFromQuery('sidebar');

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

  _restoreList({ commit, dispatch, getters }, listId) {
    commit('removeListFromBin', listId);

    this.$config.axios.patch(`${this.$config.apiBasePath}list/restore/${listId}`)
      .catch(error => {
        notifyAboutError(error.response.status, error.response.data.message);
      })
      .finally(async () => {
        await dispatch('_fetchingAfterBinActions', false);

        if (getters.lists.length) {
          dispatch('_fetchCurrentItems');
        }
      });
  },

  _restoreItem({ commit, dispatch }, { listId, itemId }) {
    commit('removeItemFromBin', itemId);

    this.$config.axios.patch(`${this.$config.apiBasePath}item/restore/${listId}/${itemId}`)
      .catch(error => {
        notifyAboutError(error.response.status, error.response.data.message);
      })
      .finally(() => {
        dispatch('_fetchingAfterBinActions', true);
      });
  },

  _hardDeleteList({ dispatch, commit }, listId) {
    commit('removeListFromBin', listId);

    this.$config.axios.delete(`${this.$config.apiBasePath}list/hard-delete/${listId}`)
      .catch(error => {
        notifyAboutError(error.response.status, error.response.data.message);
      })
      .finally(() => {
        dispatch('_fetchDeletedLists');
      });
  },

  _hardDeleteItem({ dispatch, commit }, { listId, itemId }) {
    commit('removeItemFromBin', itemId);

    this.$config.axios.delete(`${this.$config.apiBasePath}item/hard-delete/${listId}/${itemId}`)
      .catch(error => {
        notifyAboutError(error.response.status, error.response.data.message);
      })
      .finally(() => {
        dispatch('_fetchDeletedItems');
      });
  },

  _hardDeleteAllItems({ commit, dispatch }) {
    commit('removeBulkFromBin', 'items');

    this.$config.axios.delete(`${this.$config.apiBasePath}item/hard-delete-all`)
      .catch(error => {
        notifyAboutError(error.response.status, error.response.data.message);
      })
      .finally(() => {
        dispatch('_fetchDeletedItems');
      });
  },

  _restoreAllItems({ commit, dispatch }) {
    commit('removeBulkFromBin', 'items');

    this.$config.axios.patch(`${this.$config.apiBasePath}item/restore-all`)
      .catch(error => {
        notifyAboutError(error.response.status, error.response.data.message);
      })
      .finally(() => {
        dispatch('_fetchingAfterBinActions', true);
      });
  },

  _hardDeleteAllLists({ commit, dispatch }) {
    commit('removeBulkFromBin', 'lists');

    this.$config.axios.delete(`${this.$config.apiBasePath}list/hard-delete-all`)
      .catch(error => {
        notifyAboutError(error.response.status, error.response.data.message);
      })
      .finally(() => {
        dispatch('_fetchDeletedLists');
      });
  },

  _restoreAllLists({ commit, dispatch, getters }) {
    commit('removeBulkFromBin', 'lists');

    this.$config.axios.patch(`${this.$config.apiBasePath}list/restore-all`)
      .catch(error => {
        notifyAboutError(error.response.status, error.response.data.message);
      })
      .finally(async () => {
        await dispatch('_fetchingAfterBinActions', false);

        if (getters.currentListObj) {
          dispatch('_fetchCurrentItems');
        }
      });
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
