import { router } from '@/router'; // eslint-disable-line import/no-cycle
import { pushRouteKeepQuery, changeQueryRespectingDefault } from '@/router/utils'; // eslint-disable-line import/no-cycle
// eslint-disable-next-line import/no-cycle
import {
  notifyAboutError,
  commitFromRoot,
  dispatchFromRoot,
  generateTitleFromDetails,
} from '@/store/utils';
import { Item } from '@/models/models'; // eslint-disable-line import/no-cycle

export default {
  _setListIdFromLocalStorage({ commit, dispatch }) {
    const currentListId = localStorage.getItem('currentListId');

    if (currentListId) {
      commit('setCurrentListId', currentListId);
      dispatch('_fetchListById', { id: currentListId, cancelToken: null });
    }
  },

  _fetchListsForUser({ commit, dispatch }) {
    commitFromRoot('increaseExplicitRequestsNumber');

    return this.$config.axios
      .get(`${this.$config.apiBasePath}lists`)
      .then(({ data: responseLists }) => {
        commit('setLists', responseLists);

        const routerValues = router.currentRoute._value;

        if (routerValues.name !== 'item' && !routerValues.params.id) {
          dispatch('_setListIdFromLocalStorage');
        }
      })
      .finally(() => {
        commitFromRoot('decreaseExplicitRequestsNumber');
      });
  },

  _refreshListForEdittingForm({ commit }, { id, cancelToken }) {
    commitFromRoot('increaseExplicitRequestsNumber');

    return this.$config.axios
      .get(
        `${this.$config.apiBasePath}list/${id}`,
        { cancelToken },
      )
      .then(({ data: responseList }) => {
        commit('updateList', responseList);
        commit('setListForEditting', responseList);

        return responseList;
      })
      .catch(error => {
        if (!cancelToken) {
          notifyAboutError(error);
        }

        console.log(error);
      })
      .finally(() => {
        commitFromRoot('decreaseExplicitRequestsNumber');
      });
  },

  _fetchListById({ commit, dispatch, getters }, { id, cancelToken }) {
    commitFromRoot('increaseExplicitRequestsNumber');
    
    if (!getters.modalNameToShow) {
      dispatch('_setCurrentListId', id);
    }

    if (getters.currentListObj?.items?.length) {
      if (getters.currentListObj.items[0] instanceof Object) {
        commit('setCurrentListItems', getters.currentListObj.items);
      }
    }

    return this.$config.axios
      .get(
        `${this.$config.apiBasePath}list/${id}`,
        { cancelToken },
      )
      .then(({ data: responseList }) => {
        if (getters.isUserOwnsCurrentList) {
          commit('updateList', responseList);
        }
        
        commit('setCurrentListItems', responseList.items);
        commit('setCurrentListObj', responseList);

        return responseList;
      })
      .catch(error => {
        if (!cancelToken) {
          notifyAboutError(error);
          dispatch('_setCurrentListId', null);
        }

        console.log(error);
      })
      .finally(() => {
        commitFromRoot('decreaseExplicitRequestsNumber');
      });
  },

  _addList({ commit, dispatch }, list) {
    commitFromRoot('increaseExplicitRequestsNumber');

    return this.$config.axios
      .post(
        `${this.$config.apiBasePath}list/add`,
        list,
      )
      .then(({ data: responseList }) => {
        commit('addList', responseList);
        dispatch('_setCurrentListId', responseList.id);
        commit('setCurrentListObj', responseList);
      })
      .finally(() => {
        commitFromRoot('decreaseExplicitRequestsNumber');
      });
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
      .patch(
        `${this.$config.apiBasePath}list/update/${id}`,
        {
          title,
          isPrivate,
          tags,
          categories,
        },
      )
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
    commitFromRoot('increaseExplicitRequestsNumber');

    await this.$config.axios.delete(`${this.$config.apiBasePath}list/delete/${id}`);

    if (getters.currentListObj?.id === id) {
      if (getters.lists.length > 1) {
        const anotherId = getters.lists.find(list => list.id !== id).id;

        dispatch('_fetchListById', { id: anotherId, cancelToken: null });
      } else {
        commit('setCurrentListItems', []);
        commit('setCurrentListObj', null);
        localStorage.removeItem('currentListId');
        router.push({ name: 'home', query: { sidebar: 'lists' } });
      }

      dispatch('visualization/_resetVisualizationToDefault');
      commit('filters/resetFilters');
    }

    commit('deleteList', id);
    commitFromRoot('decreaseExplicitRequestsNumber');
  },

  _setCurrentListId({ commit }, id) {
    commit('setCurrentListItems', []);

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

  _setListForEditting({ commit, dispatch }, list) {
    commit('setListForEditting', list);

    if (list) {
      dispatch('_refreshListForEdittingForm', { id: list.id, cancelToken: null });
    }
  },

  _setCurrentListView({ commit }, viewType) {
    changeQueryRespectingDefault('currentListView', viewType);
    commit('setCurrentListView', viewType);
  },

  // list items

  _fetchCurrentListItems({ commit, getters }) {
    commitFromRoot('increaseExplicitRequestsNumber');

    return this.$config.axios
      .get(`${this.$config.apiBasePath}list/${getters.currentListId}`)
      .then(({ data: responseList }) => {
        commit('setCurrentListItems', responseList.items);
      })
      .finally(() => {
        commitFromRoot('decreaseExplicitRequestsNumber');
      });
  },

  _fetchItemsByListId(state, { id, cancelToken }) {
    return this.$config.axios
      .get(
        `${this.$config.apiBasePath}list/${id}`,
        { cancelToken },
      )
      .then(({ data: responseList }) => {
        return responseList;
      })
      .catch(error => {
        if (!cancelToken) {
          notifyAboutError(error);
        }

        throw error;
      });
  },

  // test lists

  _fetchTestLists({ commit }) {
    return this.$config.axios
      .get('/test_data.json')
      .then(({ data: responseLists }) => {
        commit('setTestLists', responseLists);
      });
  },

  async _copyTestListToUserLists({ commit, dispatch }, {
    title,
    isPrivate,
    tags,
    categories,
    items,
  }) {
    commitFromRoot('increaseExplicitRequestsNumber');

    try {
      const { data: responseList } = await this.$config.axios.post(
        `${this.$config.apiBasePath}list/add`,
        {
          title,
          isPrivate,
          tags,
          categories,
        },
      );
  
      commit('addList', responseList);
      dispatch('_setCurrentListId', responseList.id);
      pushRouteKeepQuery({
        name: 'list',
        params: { id: responseList.id },
      });
  
      const { data: responseItems } = await this.$config.axios.post(
        `${this.$config.apiBasePath}items/add-many/${responseList.id}`,
        { items },
      );
  
      commit('addItemsFromTestList', responseItems);
      commit('setCurrentListItems', responseItems);
      commit('setCurrentListObj', responseList);
      commitFromRoot('decreaseExplicitRequestsNumber');
    } catch (error) {
      notifyAboutError(error);
      commitFromRoot('decreaseExplicitRequestsNumber');
    }
  },

  // items

  _fetchItemById({ commit }, { id, cancelToken }) {
    commitFromRoot('increaseExplicitRequestsNumber');

    return this.$config.axios
      .get(
        `${this.$config.apiBasePath}item/${id}`,
        { cancelToken },
      )
      .then(({ data }) => {
        commit('setCurrentItemObj', data);
      })
      .catch(error => {
        if (!cancelToken) {
          notifyAboutError(error);
        }

        console.log(error);
      })
      .finally(() => {
        commitFromRoot('decreaseExplicitRequestsNumber');
      });
  },

  _findAndSetEdittingItemIndex({ state, commit, getters }, targetItem) {
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
      const listIndex = getters.lists.findIndex(list => list.id === listId);

      itemIndex = getters.lists[listIndex].items
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
    dispatch('_findAndSetEdittingItemIndex', itemWithTemporaryId);
  },

  _addItemOnServer({ commit, getters, dispatch }, { item, cancelToken }) {
    const listId = getters.currentListObj.id;
    const title = item.title || generateTitleFromDetails(item.details);

    this.$config.axios
      .post(
        `${this.$config.apiBasePath}item/add/${listId}`, 
        {
          ...item,
          title,
        }, 
        { cancelToken },
      )
      .then(({ data: responseItem }) => {
        commit('updateItemByTemporaryId', responseItem);
        commit('setCurrentItemObj', responseItem);
      })
      .catch(error => {
        notifyAboutError(error);
        dispatch('_fetchListById', { id: listId, cancelToken: null });
      });
  },

  _updateItemOnServer({ commit, dispatch }, { item, cancelToken }) {
    const title = item.title || generateTitleFromDetails(item.details);

    this.$config.axios
      .patch(
        `${this.$config.apiBasePath}item/update/${item.listId}/${item.id}`,
        {
          details: item.details,
          tags: item.tags,
          category: item.category,
          relatedLists: item.relatedLists,
          relatedItems: item.relatedItems,
          title,
        },
        { cancelToken },
      )
      .then(({ data: responseList }) => {
        commit('updateItemFieldsByServerResponse', responseList);
      })
      .catch(error => {
        if (!cancelToken) {
          notifyAboutError(error);
          dispatch('_fetchItemById', { id: item.id, cancelToken: null });
        }
      });
  },
  
  async _deleteItem({ commit, dispatch }, item) {
    commit('deleteItem', item.id);
    
    this.$config.axios
      .delete(`${this.$config.apiBasePath}item/delete/${item.listId}/${item.id}`)
      .then(() => {
        dispatchFromRoot('bin/_fetchDeletedItems');
      })
      .catch(async error => {
        notifyAboutError(error);
        dispatch('_fetchListById', { id: item.listId, cancelToken: null });
      });
  },
};
