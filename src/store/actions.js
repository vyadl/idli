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

const UNITS_AND_MUTATIONS_ACCORDANCE = {
  settings: 'setSettings',
};

export default {
  // local storage

  _setListIdFromLocalStorage({ commit, dispatch }) {
    const currentListId = localStorage.getItem('currentListId');

    if (currentListId) {
      commit('setCurrentListId', currentListId);
      dispatch('_fetchListById', { id: currentListId, cancelToken: null });
    }
  },
  _saveUnitInLocalStorage({ getters }, unitName) {
    if (!getters.isPublicView) {
      localStorage.setItem(unitName, JSON.stringify(getters[unitName]));
    }
  },
  _setUnitsFromLocalStorage({ commit }, units) {
    units.forEach(unit => {
      const value = localStorage.getItem(unit);

      if (value) {
        commit(UNITS_AND_MUTATIONS_ACCORDANCE[unit], JSON.parse(value));
      }
    });
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
  _fetchPublicList({ commit, dispatch, getters }, { id, cancelToken }) {
    dispatch('_setCurrentListId', id);

    return this.$config.axios
      .get(`${this.$config.apiBasePath}list/public/${id}`, { cancelToken })
      .then(({ data: responseList }) => {
        if (getters.isUserOwnsCurrentList) {
          commit('updateList', responseList);
        }
        
        commit('setCurrentItems', responseList.items);
        commit('setCurrentListObj', responseList);

        return responseList;
      })
      .catch(error => {
        if (!cancelToken) {
          notifyAboutError(error);
          dispatch('_setCurrentListId', null);
        }

        throw error;
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
        if (getters.isUserOwnsCurrentList) {
          commit('updateList', responseList);
        }
        
        commit('setCurrentItems', responseList.items);
        commit('setCurrentListObj', responseList);

        return responseList;
      })
      .catch(error => {
        if (!cancelToken) {
          notifyAboutError(error);
          dispatch('_setCurrentListId', null);
        }

        throw error;
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
        commit('setCurrentListObj', responseList);
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
    commit('setCurrentListObj', responseList);
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
        commit('setCurrentListObj', responseList);
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
        commit('setCurrentListObj', null);
        localStorage.removeItem('currentListId');
        router.push({ name: 'home', query: { sidebar: 'lists' } });
      }

      commit('resetVisualizationToDefault');
      commit('resetFilters');
    }

    commit('deleteList', id);
    commit('decreaseExplicitRequestsNumber');
  },
  _setCurrentListId({ commit }, id) {
    commit('setCurrentItems', []);

    if (id) {
      commit('setCurrentListId', id);
      localStorage.setItem('currentListId', id);

      if (router.currentRoute._value.name !== 'item') {
        pushRouteKeepQuery({
          name: 'list',
          params: { id },
        });
      }
    } else {
      commit('setCurrentListId', null);
      localStorage.removeItem('currentListId');
      pushRouteKeepQuery({
        name: 'home',
      });
    }
  },
  _setListForEditting({ commit }, list) {
    commit('setListForEditting', list);
  },
  _setCurrentListView({ commit }, viewType) {
    changeQueryRespectingDefault('currentListView', viewType);
    commit('setCurrentListView', viewType);
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
    let itemIndex = null;

    function compareItemsById(item1, item2) {
      return item1.temporaryId 
        ? item1.temporaryId === item2.temporaryId
        : item1.id === item2.id;
    } 

    if (state.currentListId) {
      itemIndex = state.currentListItems
        .findIndex(item => compareItemsById(item, targetItem));
    } else {
      const { listId } = targetItem;
      const listIndex = state.lists.findIndex(list => list.id === listId);

      itemIndex = state.lists[listIndex].items
        .findIndex(item => compareItemsById(item, targetItem));
    }

    commit('setEdittingItemIndex', itemIndex);
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
    const listId = getters.currentListObj.id;
    const title = item.title || generateTitleFromDetails(item.details);

    this.$config.axios
      .post(`${this.$config.apiBasePath}item/add/${listId}`, {
        ...item,
        title,
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
    const title = item.title || generateTitleFromDetails(item.details);

    this.$config.axios
      .patch(`${this.$config.apiBasePath}item/update/${item.listId}/${item.id}`, {
        details: item.details,
        tags: item.tags,
        category: item.category,
        title,
      }, {
        cancelToken,
      })
      .then(({ data: responseList }) => {
        commit('updateItemFieldsByServerResponse', responseList);
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
  _filterList({ state, getters, commit }, list) {
    const tags = getters.checkedTags;
    const categories = getters.checkedCategories;
    const lowerCasedSearchValue = state.filters.currentSearchValue.toLowerCase();

    const filteredList = list.filter(item => {
      const areTagsIntersection = !tags.length || tags.every(tag => item.tags.includes(tag));
      const isCategoryIntersection = !categories.length || categories.includes(item.category);
      
      const isSearchValueRelevant = state.filters.currentSearchValue 
        && state.filters.currentSearchValue.length >= MIN_SEARCH_SYMBOLS;
      const isIncludesSearchValue = !isSearchValueRelevant
        || item.title.toLowerCase().includes(lowerCasedSearchValue)
        || item.details.toLowerCase().includes(lowerCasedSearchValue);

      return areTagsIntersection && isCategoryIntersection && isIncludesSearchValue;
    });

    commit('setFilteredList', filteredList);
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
  _toggleShuffleTrigger({ commit }) {
    commit('toggleShuffleTrigger');
  },
  _setListAlign({ commit }, align) {
    commit('setListAlign', align);
    changeQueryRespectingDefault('align', align);
  },
  _toggleItemsOrder({ getters, commit }) {
    commit('toggleItemsOrder');
    changeQueryRespectingDefault('isItemsOrderReversed', getters.isItemsOrderReversed);
  },
  _toggleItemDetailsShowingMode({ getters, commit }) {
    commit('toggleItemDetailsShowingMode');
    changeQueryRespectingDefault('areItemDetailsShown', getters.areItemDetailsShown);
  },

  // reset views

  _resetFilters({ commit }) {
    commit('resetFilters');
    deleteFromQuery([
      'search',
      'tags',
      'categories',
    ]);
  },
  _resetVisualizationToDefault({ commit }) {
    commit('resetVisualizationToDefault');

    deleteFromQuery([
      'sorting',
      'mode',
      'submode',
      'reverse-order',
      'with-details',
    ]);
  },
  _resetCustomView({ commit }) {
    commit('resetFilters');
    commit('resetVisualizationToDefault');
    deleteFromQuery([
      'sorting',
      'mode',
      'submode',
      'reverse-order',
      'with-details',
      'search',
      'tags',
      'categories',
    ]);
  },

  // settings

  _switchItemFormLocation({ commit, dispatch }) {
    commit('switchItemFormLocation');
    dispatch('_saveUnitInLocalStorage', 'settings');
  },
  _toggleFocusMode({ getters, commit, dispatch }) {
    commit('toggleFocusMode');

    if (getters.isFocusOnList) {
      commit('setNotification', { text: 'press Esc to exit focus mode' });
    }

    dispatch('_saveUnitInLocalStorage', 'settings');
  },
  _switchSidebarAndListIntersection({ commit, dispatch }) {
    commit('switchSidebarAndListIntersection');
    dispatch('_saveUnitInLocalStorage', 'settings');
  },
  _switchUsingHotkeys({ commit, dispatch }) {
    commit('switchUsingHotkeys');
    dispatch('_saveUnitInLocalStorage', 'settings');
  },
  _setTheme({ commit, dispatch }, theme) {
    commit('setTheme', theme);
    dispatch('_saveUnitInLocalStorage', 'settings');
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
