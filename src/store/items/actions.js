// eslint-disable-next-line import/no-cycle
import {
  notifyAboutError,
  commitFromRoot,
  dispatchFromRoot,
  generateTitleFromDetails,
} from '@/store/utils';
import { Item } from '@/models/models'; // eslint-disable-line import/no-cycle

export default {
  _openSingleItemInNewTab({ getters }) {
    window.open(`${window.location.origin}/item/${getters.currentItemObj.id}`, '_blank');
  },

  _copySingleItemLink({ getters }) {
    navigator.clipboard.writeText(`${window.location.origin}/item/${getters.currentItemObj.id}`);
  },

  _syncCachedItemWithServerItem(
    { getters, commit, dispatch },
    { cachedItem, responseItem },
  ) {
    const isItemsVersionsMatch = cachedItem.updatedAt === responseItem.updatedAt;

    function checkItemsEquality({ firstItem, secondItem }) {
      return Object.keys(firstItem).every(
        key => {
          return firstItem[key] instanceof Object
            ? firstItem[key].every(
              (e, i) => JSON.stringify(e) === JSON.stringify(secondItem[key][i]),
            )
            : firstItem[key] === secondItem[key];
        },
      );
    }

    if (isItemsVersionsMatch) {
      const isItemChangedBeforeServerResponse = checkItemsEquality({
        firstItem: getters.currentItemObj, 
        secondItem: cachedItem,
      });

      commit('setIsItemSavingAllowed', true);

      if (isItemChangedBeforeServerResponse) {
        dispatch('_updateItemOnServer', {
          item: getters.currentItemObj,
          cancelToken: null,
        });
      }
    } else {
      commit('setResponseItemObj', responseItem);
      commitFromRoot('setModalNameToShow', 'itemConflictModal');
    }
  },

  _fetchItemById(
    { commit, dispatch, rootGetters }, 
    { id, cancelToken },
  ) {
    const cachedItem = rootGetters['cache/cache'][id];

    if (cachedItem) {
      commit('setCurrentItemObj', cachedItem);
      commit('setIsItemSavingAllowed', false);
    }
    
    commitFromRoot('increaseExplicitRequestsNumber');

    return this.$config.axios
      .get(
        `${this.$config.apiBasePath}item/${id}`,
        { cancelToken },
      )
      .then(({ data: responseItem }) => {
        const isItemFormDisplayed = rootGetters['sidebar/sidebarMode'] === 'item' 
          || !rootGetters['settings/isItemFormInSidebar'];

        if (isItemFormDisplayed) {
          const isCachedItemNeedHanding = cachedItem && rootGetters['lists/isOwnerView'];

          isCachedItemNeedHanding
            ? dispatch('_syncCachedItemWithServerItem', { cachedItem, responseItem })
            : commit('setCurrentItemObj', responseItem);
        }

        dispatchFromRoot('cache/_saveItemInCache', responseItem);

        return responseItem;
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

  _addNewItemPlaceholder({ commit, rootGetters }) {
    const unsavedItem = rootGetters.currentListItems.find(item => item.temporaryId);

    if (!unsavedItem) {
      const newItem = new Item();
      const itemWithTemporaryId = {
        ...newItem,
        temporaryId: Date.now(),
        listId: rootGetters['lists/currentListId'],
      };

      commitFromRoot('addItem', itemWithTemporaryId);
      commit('setCurrentItemObj', itemWithTemporaryId);
    } else {
      commit('setCurrentItemObj', unsavedItem);
    }

    rootGetters['settings/isItemFormInSidebar']
      ? dispatchFromRoot('sidebar/_openSidebar', 'item')
      : commitFromRoot('setModalNameToShow', 'itemModal');
  },

  _saveItemOnServer({
    commit,
    dispatch,
    getters,
    rootGetters,
  }, item) {
    const { details } = item;
    let { title } = item;

    if (!title && details) {
      title = generateTitleFromDetails(details);

      if (rootGetters.currentListItems) {
        commitFromRoot(
          'updateItemFieldInCurrentList',
          { field: 'title', value: title },
        );
      }

      if (getters.currentItemObj) {
        commit('updateItemFieldLocally', {
          field: 'title',
          value: title,
        });
      }
    }

    const newItem = {
      ...item,
      title,
    };

    dispatch(item.temporaryId
      ? '_addItemOnServer'
      : '_updateItemOnServer', {
      item: newItem,
      cancelToken: null,
    });
  },

  _addItemOnServer({ rootGetters, getters, commit }, { item, cancelToken }) {
    const listId = rootGetters['lists/currentListObj'].id;
    const { details } = item;
    let { title } = item;

    if (!title && details) {
      title = generateTitleFromDetails(details);
    }

    this.$config.axios
      .post(
        `${this.$config.apiBasePath}item/add/${listId}`, 
        {
          ...item,
          title,
          relatedItems: getters.currentRelatedItemsIds,
          relatedLists: getters.currentRelatedListsIds,
        }, 
        { cancelToken },
      )
      .then(({ data: responseItem }) => {
        commitFromRoot('updateItemByTemporaryId', responseItem);
        dispatchFromRoot('cache/_saveItemInCache', responseItem);

        if (getters.currentItemObj) {
          commit('setCurrentItemObj', responseItem);
        }
      })
      .catch(error => {
        notifyAboutError(error);
        dispatchFromRoot('lists/_fetchListById', { id: listId, cancelToken: null });
      });
  },

  _updateItemOnServer({ getters, dispatch }, { item, cancelToken }) {
    if (!getters.isItemSavingAllowed) {
      return;
    }

    let { title } = item;
    const { details } = item;

    if (!title && details) {
      title = generateTitleFromDetails(details);
    }

    this.$config.axios
      .patch(
        `${this.$config.apiBasePath}item/update/${item.listId}/${item.id}`,
        {
          ...item,
          title,
          relatedItems: getters.currentRelatedItemsIds,
          relatedLists: getters.currentRelatedListsIds,
        },
        { cancelToken },
      )
      .then(({ data: responseItem }) => {
        commitFromRoot('updateItemFieldsByServerResponse', responseItem);
        dispatchFromRoot('cache/_saveItemInCache', responseItem);
      })
      .catch(error => {
        if (!cancelToken) {
          notifyAboutError(error);
          dispatch('_fetchItemById', { id: item.id, cancelToken: null });
        }
      });
  },

  _deleteItemOnServer(state, { itemId, listId }) {
    commitFromRoot('deleteItem', itemId);
    dispatchFromRoot('cache/_removeItemFromCache', itemId);
    
    this.$config.axios
      .delete(`${this.$config.apiBasePath}item/delete/${listId}/${itemId}`)
      .then(() => {
        dispatchFromRoot('bin/_fetchDeletedItems');
      })
      .catch(error => {
        notifyAboutError(error);
        dispatchFromRoot('lists/_fetchListById', { id: listId, cancelToken: null });
      });
  },
};
