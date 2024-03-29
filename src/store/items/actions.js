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

    if (isItemsVersionsMatch) {
      const isItemChangedBeforeServerResponse = getters.currentItemObj.updatedAt
        !== cachedItem.updatedAt;
      
      commit('setIsItemSavingAllowed', true);

      if (isItemChangedBeforeServerResponse) {
        dispatch('_updateItemOnServer', {
          item: getters.currentItemObj,
          cancelToken: null,
        });
      } else {
        commit('setCurrentItemObj', responseItem);
        dispatchFromRoot('cache/_saveItemInCache', responseItem);
      }
    } else if (getters.currentItemObj) {
      commit('setResponseItemObj', responseItem);
      commitFromRoot('setModalNameToShow', 'itemConflictModal');
    }
  },

  _fetchItemById(
    { commit, dispatch, rootGetters }, 
    { id, cancelToken },
  ) {
    const cachedItem = rootGetters['cache/itemsCache'][id];

    if (cachedItem) {
      commit('setCurrentItemObj', JSON.parse(JSON.stringify(cachedItem)));
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

  _addNewItemPlaceholder({ commit, getters, rootGetters }) {
    if (rootGetters['lists/isMaxItemsCountReachedInCurrentList']) {
      commitFromRoot('setModalNameToShow', 'itemsLimitModal');

      return null;
    }

    const unsavedItem = rootGetters.currentListItems.find(item => item.temporaryId);

    if (!unsavedItem || (unsavedItem && getters.backgroundRequestsNumber)) {
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
        commitFromRoot('updateItemFieldInCurrentList', {
          field: 'title',
          value: title,
          itemId: item.id || item.temporaryId,
        });
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

        const isItemStillOpenInForm = getters.currentItemObj 
          && responseItem.temporaryId === getters.currentItemObj.temporaryId;

        // eslint-disable-next-line no-param-reassign
        delete responseItem.temporaryId;
        
        dispatchFromRoot('cache/_saveItemInCache', responseItem);
        
        if (isItemStillOpenInForm) {
          const fieldsToUpdate = [
            'createdAt',
            'updatedAt',
            'listId',
            'userId',
            'deletedAt',
            'id',
            'temporaryId',
          ];

          commit('updateCurrentItemFieldsAfterServerResponse', { fieldsToUpdate, responseItem });
        }
      })
      .catch(error => {
        notifyAboutError(error);
        dispatchFromRoot('lists/_fetchListById', { id: listId, cancelToken: null });
      });
  },

  _addBulkItemsOnServer({ rootGetters }, { items, listId }) {
    commitFromRoot('increaseExplicitRequestsNumber');

    return this.$config.axios
      .post(
        `${this.$config.apiBasePath}items/add-many/${listId}`,
        { items },
      )
      .then(({ data: responseItems }) => {
        if (rootGetters['lists/currentListId'] === listId) {
          responseItems.forEach(item => {
            commitFromRoot('addItem', item);
          });

          dispatchFromRoot('cache/_saveItemsFromListInCache', {
            id: listId,
            items: rootGetters.currentListItems,
          });
        }

        return responseItems;
      })
      .catch(error => {
        notifyAboutError(error);
        dispatchFromRoot('lists/_fetchListById', { id: listId, cancelToken: null });
      })
      .finally(() => {
        commitFromRoot('decreaseExplicitRequestsNumber');
      });
  },

  _updateItemOnServer({ getters, dispatch }, { item, cancelToken }) {
    if (!getters.isItemSavingAllowed) {
      return null;
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
    dispatchFromRoot('cache/_removeItemFromCache', { itemId, listId });
    
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
