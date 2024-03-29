import { router } from '@/router'; // eslint-disable-line import/no-cycle
import { pushRouteKeepQuery, changeQueryRespectingDefault } from '@/router/utils'; // eslint-disable-line import/no-cycle
import routerQueue from '@/router/routerQueue';
// eslint-disable-next-line import/no-cycle
import { notifyAboutError, commitFromRoot, dispatchFromRoot } from '@/store/utils';
import { getErrorMessage } from '@/backendInteraction/serverErrors';

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

        if (routerValues.name === 'list' && !routerValues.params.id) {
          dispatch('_setListIdFromLocalStorage');
        }

        dispatchFromRoot('cache/_saveAllListsInCache', responseLists);
      })
      .finally(() => {
        commitFromRoot('decreaseExplicitRequestsNumber');
      });
  },

  _refreshListForEdittingForm({ commit, rootGetters }, { id, cancelToken }) {
    commitFromRoot('increaseExplicitRequestsNumber');

    const cachedList = rootGetters['cache/listsCache'][id];

    if (cachedList) {
      commit('setEdittingListObj', cachedList);
    }

    return this.$config.axios
      .get(
        `${this.$config.apiBasePath}list/${id}?noItems=true`,
        { cancelToken },
      )
      .then(({ data: responseList }) => {
        commit('updateList', responseList);
        commit('setEdittingListObj', responseList);

        dispatchFromRoot('cache/_saveListInCache', {
          list: responseList,
          byField: true,
        });

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

  _fetchListById({
    commit,
    dispatch,
    getters,
    rootGetters,
  }, { id, cancelToken }) {
    commitFromRoot('increaseExplicitRequestsNumber');

    const cachedList = rootGetters['cache/listsCache'][id];

    if (cachedList) {
      commit('setCurrentListObj', cachedList);
    }

    if (cachedList.items?.length) {
      const fullItems = [];

      cachedList.items.forEach(item => {
        fullItems.push(rootGetters['cache/itemsCache'][item]);
      });

      commitFromRoot('setCurrentListItems', fullItems);
    }

    if (!getters.modalNameToShow) {
      dispatch('_setCurrentListId', id);
    }

    const listIndex = getters.lists.findIndex(list => list.id === id);
    const listObj = getters.lists[listIndex];

    if (listObj?.items?.length) {
      if (listObj.items[0] instanceof Object) {
        commitFromRoot('setCurrentListItems', listObj.items);
      }
    }

    return this.$config.axios
      .get(
        `${this.$config.apiBasePath}list/${id}?noReferringItems=true`,
        { cancelToken },
      )
      .then(({ data: responseList }) => {
        const { items } = responseList;

        if (getters.isUserOwnsCurrentList) {
          commit('updateList', responseList);
        }

        commitFromRoot('setCurrentListItems', items);
        commit('setCurrentListObj', responseList);

        dispatchFromRoot('cache/_saveListInCache', {
          list: responseList,
          byField: true,
        });
        dispatchFromRoot('cache/_saveItemsFromListInCache', { id, items });

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
        dispatchFromRoot('cache/_saveListInCache', { list: responseList });
      })
      .catch(error => {
        throw getErrorMessage(error.response.data);
      })
      .finally(() => {
        commitFromRoot('decreaseExplicitRequestsNumber');
      });
  },

  _updateList({ getters, commit, dispatch }, {
    title,
    isPrivate,
    tags,
    categories,
    id,
    parentListId,
    updatedAt,
  }) {
    commitFromRoot('increaseExplicitRequestsNumber');
    commit('updateList', {
      title,
      isPrivate,
      tags,
      categories,
      id,
      parentListId,
      updatedAt,
    });

    return this.$config.axios
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

        if (getters.currentListId === responseList.id) {
          commit('setCurrentListObj', responseList);
        }

        dispatchFromRoot('cache/_saveListInCache', {
          list: responseList,
          byField: true,
        });

        return responseList;
      })
      .catch(error => {
        notifyAboutError(error);
        dispatch('_fetchListsForUser');
      })
      .finally(() => {
        commitFromRoot('decreaseExplicitRequestsNumber');
      });
  },

  _updateListItemsOrder({
    commit,
    dispatch,
    getters,
    rootGetters,
  }) {
    const itemIds = rootGetters.currentListItems.map(item => item.id);

    return this.$config.axios
      .patch(
        `${this.$config.apiBasePath}list/set-order/${getters.currentListId}`,
        { itemIds },
      )
      .then(({ data: responseList }) => {
        commit('updateList', responseList);
        dispatchFromRoot('cache/_saveListInCache', {
          list: responseList,
          byField: true,
        });
        dispatchFromRoot('cache/_saveItemsFromListInCache', {
          id: responseList.id,
          items: responseList.items,
        });

        return responseList;
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
        commitFromRoot('setCurrentListItems', []);
        commit('setCurrentListObj', null);
        localStorage.removeItem('currentListId');
        router.push({ name: 'home', query: { sidebar: 'lists' } });
      }

      dispatchFromRoot('visualization/_resetVisualizationToDefault');
      commitFromRoot('filters/resetFilters');
    }

    if (getters.currentListObj?.parentListId === id) {
      const listObj = getters.lists.find(list => list.id === id);

      dispatch('_fetchListById', { id: listObj.parentListId, cancelToken: null });
    }

    const childLists = getters.lists.filter(list => list.parentListId === id);

    if (childLists.length) {
      childLists.forEach(childList => {
        commit('deleteList', childList.id);
        dispatchFromRoot('cache/_removeListFromCache', childList.id);
      });
    }

    commit('deleteList', id);
    dispatchFromRoot('cache/_removeListFromCache', id);
    commitFromRoot('decreaseExplicitRequestsNumber');
  },

  _setCurrentListId({ commit }, id) {
    commitFromRoot('setCurrentListItems', []);

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

  _setEdittingListObj({ commit, dispatch }, list) {
    commit('setEdittingListObj', list);

    if (list?.id) {
      dispatch('_refreshListForEdittingForm', { id: list.id, cancelToken: null });
    }
  },

  _setCurrentListView({ commit }, viewType) {
    routerQueue.add({
      method: changeQueryRespectingDefault,
      args: { option: 'currentListView', value: viewType },
    });
    commit('setCurrentListView', viewType);
  },

  // list items

  _fetchCurrentListItems({ getters }) {
    commitFromRoot('increaseExplicitRequestsNumber');

    return this.$config.axios
      .get(`${this.$config.apiBasePath}list/${getters.currentListId}?noReferringItems=true&noLists=true`)
      .then(({ data: responseList }) => {
        const { id, items } = responseList;

        commitFromRoot('setCurrentListItems', items);
        dispatchFromRoot('cache/_saveListInCache', {
          list: responseList,
          byField: true,
        });
        dispatchFromRoot('cache/_saveItemsFromListInCache', { id, items });
      })
      .finally(() => {
        commitFromRoot('decreaseExplicitRequestsNumber');
      });
  },

  _fetchItemsByListId(state, { id, cancelToken }) {
    return this.$config.axios
      .get(
        `${this.$config.apiBasePath}list/${id}?noReferringItems=true&noLists=true`,
        { cancelToken },
      )
      .then(({ data: responseList }) => {
        dispatchFromRoot('cache/_saveListInCache', {
          list: responseList,
          byField: true,
        });
        dispatchFromRoot('cache/_saveItemsFromListInCache', { id, items: responseList.items });

        return responseList;
      })
      .catch(error => {
        if (!cancelToken) {
          notifyAboutError(error);
        }
      });
  },

  _checkGroupingFieldTitleUniqueness({ getters }, title) {
    return !getters.currentListTagsTitles.includes(title)
      && !getters.currentListCategoriesTitles.includes(title);
  },

  _addGroupingFieldForListAndItem(
    { commit, dispatch },
    {
      listObj,
      itemObj, 
      title,
      groupingFieldType,
      isItemUpdateNeeded = true,
    },
  ) {
    commitFromRoot('increaseExplicitRequestsNumber');

    return this.$config.axios
      .patch(
        `${this.$config.apiBasePath}list/update/${listObj.id}`,
        {
          title: listObj.title,
          isPrivate: listObj.isPrivate,
          tags: listObj.tags,
          categories: listObj.categories,
        },
      )
      .then(({ data: responseList }) => {
        if (isItemUpdateNeeded) {
          dispatch('_addGroupingFieldForItem', {
            itemObj, 
            title,
            groupingFieldType,
            responseList,
          });
        }

        dispatchFromRoot('cache/_saveListInCache', {
          list: responseList,
          byField: true,
        });
        commit('setCurrentListObj', responseList);

        return responseList;
      })
      .catch(error => {
        notifyAboutError(error);
        dispatch('_fetchListById', { id: listObj.id, cancelToken: null });
      })
      .finally(() => {
        commitFromRoot('decreaseExplicitRequestsNumber');
      });
  },

  _addGroupingFieldForItem(
    { rootGetters },
    {
      responseList,
      itemObj, 
      title,
      groupingFieldType,
    },
  ) {
    const isAddingCategory = groupingFieldType === 'category';
    const newGroupingFieldObj = responseList[isAddingCategory
      ? 'categories'
      : 'tags']?.find(
      groupingField => groupingField.title === title,
    );

    if (isAddingCategory) {
      // eslint-disable-next-line no-param-reassign
      itemObj[groupingFieldType] = newGroupingFieldObj.id;
    } else {
      itemObj[groupingFieldType].push(newGroupingFieldObj.id);
    }

    if (rootGetters.currentListItems) {
      commitFromRoot('updateItemFieldInCurrentList', {
        field: `${groupingFieldType}`,
        value: itemObj[groupingFieldType],
        itemId: itemObj.id || itemObj.temporaryId,
      });
    }
    
    if (rootGetters['items/currentItemObj']) {
      commitFromRoot('items/updateItemFieldLocally', {
        field: `${groupingFieldType}`,
        value: itemObj[groupingFieldType],
      });
    }

    dispatchFromRoot('items/_saveItemOnServer', itemObj);
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
      commit('setCurrentListObj', responseList);
      commitFromRoot('setCurrentListItems', responseItems);

      dispatchFromRoot('cache/_saveListInCache', { list: responseList });
      dispatchFromRoot('cache/_saveItemsFromListInCache', {
        id: responseList.id, 
        items: responseItems,
      });
    } catch (error) {
      throw getErrorMessage(error.response.data);
    } finally {
      commitFromRoot('decreaseExplicitRequestsNumber');
    }
  },
};
