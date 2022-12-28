import { router } from '@/router'; // eslint-disable-line import/no-cycle
import { pushRouteKeepQuery, changeQueryRespectingDefault } from '@/router/utils'; // eslint-disable-line import/no-cycle
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
      .then(({ data: responseList }) => {
        commit('setLists', responseList);

        const routerValues = router.currentRoute._value;

        if (routerValues.name === 'list' && !routerValues.params.id) {
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

    const listIndex = getters.lists.findIndex(list => list.id === id);
    const listObj = getters.lists[listIndex];

    if (listObj?.items?.length) {
      if (listObj.items[0] instanceof Object) {
        commitFromRoot('setCurrentListItems', listObj.items);
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
        commitFromRoot('setCurrentListItems', responseList.items);
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
      .catch(error => {
        throw getErrorMessage(error.response.data);
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
    commitFromRoot('increaseExplicitRequestsNumber');
    commit('updateList', {
      title,
      isPrivate,
      tags,
      categories,
      id,
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
        commit('setCurrentListObj', responseList);
        commitFromRoot('setCurrentListItems', responseList.items);

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

    commit('deleteList', id);
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

  _fetchCurrentListItems({ getters }) {
    commitFromRoot('increaseExplicitRequestsNumber');

    return this.$config.axios
      .get(`${this.$config.apiBasePath}list/${getters.currentListId}`)
      .then(({ data: responseList }) => {
        commitFromRoot('setCurrentListItems', responseList.items);
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
      });
  },

  _addTagForListAndItem({ dispatch, getters, rootGetters }, { listObj, tagTitle }) {
    return dispatch('_updateList', listObj)
      .then(() => {
        const newTagObj = getters.currentListTags?.find(tag => tag.title === tagTitle);

        commitFromRoot('updateItemFieldLocally', {
          field: 'tags',
          value: [...rootGetters['items/edittingItemObj'].tags, newTagObj.id],
        });

        dispatchFromRoot('items/_saveItemOnServer');
      });
  },

  _addCategoryForListAndItem({ dispatch, getters }, { listObj, categoryTitle }) {
    return dispatch('_updateList', listObj)
      .then(() => {
        const newCategoryObj = getters.currentListCategories?.find(
          category => category.title === categoryTitle,
        );

        commitFromRoot('updateItemFieldLocally', {
          field: 'category',
          value: newCategoryObj.id,
        });

        dispatchFromRoot('items/_saveItemOnServer');
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
      commitFromRoot('setCurrentListItems', responseItems);
      commit('setCurrentListObj', responseList);
    } catch (error) {
      throw getErrorMessage(error.response.data);
    } finally {
      commitFromRoot('decreaseExplicitRequestsNumber');
    }
  },
};
