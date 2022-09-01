// eslint-disable-next-line import/no-cycle
import { 
  addQueryItems,
  pushRouteKeepQuery,
  deleteFromQuery,
  changeQuery,
  changeQueryRespectingDefault,
} from '@/router/utils';
// eslint-disable-next-line import/no-cycle
import { notifyAboutError, generateTitleFromDetails } from '@/store/utils';
// eslint-disable-next-line import/no-cycle
import { router } from '@/router';
import { MIN_SEARCH_SYMBOLS } from '@/store/config';
import { Item } from '@/models/models';
// import { debounce } from 'throttle-debounce';

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
    commit('increaseExplicitRequestsNumber');

    return this.$config.axios.get(`${this.$config.apiBasePath}lists`)
      .then(({ data: responseLists }) => {
        commit('setLists', responseLists);

        const routerValues = router.currentRoute._value;

        if (routerValues.name !== 'item' && !routerValues.params.id) {
          dispatch('_setListIdFromLocalStorage');
        }
      })
      .finally(() => {
        commit('decreaseExplicitRequestsNumber');
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
        if (!cancelToken) {
          notifyAboutError(error);
        }
      });
  },
  _fetchCurrentItems({ commit, getters }) {
    commit('increaseExplicitRequestsNumber');

    return this.$config.axios
      .get(`${this.$config.apiBasePath}list/${getters.currentListId}`)
      .then(({ data: responseList }) => {
        commit('setCurrentItems', responseList.items);
      })
      .finally(() => {
        commit('decreaseExplicitRequestsNumber');
      });
  },
  _addList({ commit, dispatch }, list) {
    commit('increaseExplicitRequestsNumber');

    return this.$config.axios
      .post(`${this.$config.apiBasePath}list/add`, list)
      .then(({ data: responseList }) => {
        commit('addList', responseList);
        dispatch('_setCurrentListId', responseList.id);
      })
      .finally(() => {
        commit('decreaseExplicitRequestsNumber');
      });
  },
  async _copyTestListToUserLists({ commit, dispatch }, {
    title,
    isPrivate,
    tags,
    categories,
    items,
  }) {
    commit('increaseExplicitRequestsNumber');

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
    commit('decreaseExplicitRequestsNumber');
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
        notifyAboutError(error);
        dispatch('_fetchListsForUser');
      });
  },
  async _deleteList({ commit, dispatch, getters }, id) {
    commit('increaseExplicitRequestsNumber');

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
    commit('decreaseExplicitRequestsNumber');
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

  _fetchItemById({ commit }) {
    commit('increaseExplicitRequestsNumber');

    return this.$config.axios
      .get(
        `${this.$config.apiBasePath}item/${router.currentRoute._value.params.id}`,
        { cancelToken: null },
      )
      .then(({ data }) => data)
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        commit('decreaseExplicitRequestsNumber');
      });
  },
  _setEdittingItemIndex({ state, commit }, targetItem) {
    if (state.currentListId) {
      commit('setEdittingItemIndex', state.currentListItems.findIndex(item => {
        return targetItem.temporaryId 
          ? item.temporaryId === targetItem.temporaryId : item.id === targetItem.id;
      }));
    } else {
      const { listId } = targetItem;
      const listIndex = state.lists.findIndex(list => list.id === listId);
  
      commit('setEdittingItemIndex', state.lists[listIndex].items.findIndex(item => {
        return targetItem.temporaryId 
          ? item.temporaryId === targetItem.temporaryId : item.id === targetItem.id;
      }));
    }
  },
  _addNewItemPlaceholder({ commit, dispatch }) {
    const newItem = new Item();
    const itemWithTemporaryId = {
      ...newItem,
      temporaryId: Date.now(),
    };

    commit('addItem', itemWithTemporaryId);
    dispatch('_setEdittingItemIndex', itemWithTemporaryId);
  },
  _addItemOnServer({ commit, getters, dispatch }, { item, cancelToken }) {
    if (!item.title) {
      // eslint-disable-next-line no-param-reassign
      item.title = generateTitleFromDetails(item.details);
    }

    const listId = getters.currentListObj.id;

    this.$config.axios
      .post(`${this.$config.apiBasePath}item/add/${listId}`, {
        ...item,
      }, {
        cancelToken,
      })
      .then(({ data: responseItem }) => {
        commit('updateItemByTemporaryId', responseItem);
      })
      .catch(error => {
        notifyAboutError(error);
        dispatch('_fetchListById', { id: listId, cancelToken: null });
      });
  },
  _updateItemOnServer({ commit, dispatch }, { item, cancelToken }) {
    if (!item.title) {
      // eslint-disable-next-line no-param-reassign
      item.title = generateTitleFromDetails(item.details);
    }

    this.$config.axios
      .patch(`${this.$config.apiBasePath}item/update/${item.listId}/${item.id}`, {
        title: item.title,
        details: item.details,
        tags: item.tags,
        category: item.category,
      }, {
        cancelToken,
      })
      .then(({ data: responseList }) => {
        commit('updateItemMetaFields', responseList);
      })
      .catch(error => {
        if (!cancelToken) {
          notifyAboutError(error);
          dispatch('_fetchListById', { id: item.listId, cancelToken: null });
        }
      });
  },
  _deleteItemByTemporaryId({ commit }, item) {
    commit('deleteItemByTemporaryId', item.temporaryId);
  },
  async _deleteItem({ commit, dispatch }, item) {
    commit('deleteItem', item.id);
    
    this.$config.axios.delete(`${this.$config.apiBasePath}item/delete/${item.listId}/${item.id}`)
      .catch(async error => {
        notifyAboutError(error);
        await dispatch('_fetchListById', { id: item.listId, cancelToken: null });
      });
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
    commit('setModalNameToShow', name);
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

  _fetchBin({ commit, dispatch }) {
    commit('increaseExplicitRequestsNumber');

    Promise.all([dispatch('_fetchDeletedLists'), dispatch('_fetchDeletedItems')])
      .finally(() => {
        commit('decreaseExplicitRequestsNumber');
      });
  },

  _restoreList({ commit, dispatch, getters }, listId) {
    commit('increaseExplicitRequestsNumber');
    commit('removeListFromBin', listId);

    this.$config.axios.patch(`${this.$config.apiBasePath}list/restore/${listId}`)
      .catch(error => {
        notifyAboutError(error);
      })
      .finally(async () => {
        commit('decreaseExplicitRequestsNumber');
        await dispatch('_fetchingAfterBinActions', false);

        if (getters.lists.length) {
          dispatch('_fetchCurrentItems');
        }
      });
  },

  _restoreItem({ commit, dispatch }, { listId, itemId }) {
    commit('increaseExplicitRequestsNumber');
    commit('removeItemFromBin', itemId);

    this.$config.axios.patch(`${this.$config.apiBasePath}item/restore/${listId}/${itemId}`)
      .catch(error => {
        notifyAboutError(error);
      })
      .finally(() => {
        commit('decreaseExplicitRequestsNumber');
        dispatch('_fetchingAfterBinActions', true);
      });
  },

  _hardDeleteList({ dispatch, commit }, listId) {
    commit('removeListFromBin', listId);

    this.$config.axios.delete(`${this.$config.apiBasePath}list/hard-delete/${listId}`)
      .catch(error => {
        notifyAboutError(error);
      })
      .finally(() => {
        dispatch('_fetchDeletedLists');
      });
  },

  _hardDeleteItem({ dispatch, commit }, { listId, itemId }) {
    commit('removeItemFromBin', itemId);

    this.$config.axios.delete(`${this.$config.apiBasePath}item/hard-delete/${listId}/${itemId}`)
      .catch(error => {
        notifyAboutError(error);
      })
      .finally(() => {
        dispatch('_fetchDeletedItems');
      });
  },

  _hardDeleteAllItems({ commit, dispatch }) {
    commit('removeBulkFromBin', 'items');

    this.$config.axios.delete(`${this.$config.apiBasePath}item/hard-delete-all`)
      .catch(error => {
        notifyAboutError(error);
      })
      .finally(() => {
        dispatch('_fetchDeletedItems');
      });
  },

  _restoreAllItems({ commit, dispatch }) {
    commit('increaseExplicitRequestsNumber');
    commit('removeBulkFromBin', 'items');

    this.$config.axios.patch(`${this.$config.apiBasePath}item/restore-all`)
      .catch(error => {
        notifyAboutError(error);
      })
      .finally(() => {
        commit('decreaseExplicitRequestsNumber');
        dispatch('_fetchingAfterBinActions', true);
      });
  },

  _hardDeleteAllLists({ commit, dispatch }) {
    commit('removeBulkFromBin', 'lists');

    this.$config.axios.delete(`${this.$config.apiBasePath}list/hard-delete-all`)
      .catch(error => {
        notifyAboutError(error);
      })
      .finally(() => {
        dispatch('_fetchDeletedLists');
      });
  },

  _restoreAllLists({ commit, dispatch, getters }) {
    commit('increaseExplicitRequestsNumber');
    commit('removeBulkFromBin', 'lists');

    this.$config.axios.patch(`${this.$config.apiBasePath}list/restore-all`)
      .catch(error => {
        notifyAboutError(error);
      })
      .finally(async () => {
        commit('decreaseExplicitRequestsNumber');
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
