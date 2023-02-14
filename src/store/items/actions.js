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

  _fetchItemById(
    {
      getters,
      commit,
      dispatch,
      rootGetters,
    }, 
    { id, cancelToken },
  ) {
    const fullCachedItem = getters.cache[id];
    const cachedItem = fullCachedItem || getters.partialCache[id];

    if (cachedItem) {
      commit('setCurrentItemObj', cachedItem);
    }

    commitFromRoot('increaseExplicitRequestsNumber');
    commit('setIsItemSavingAllowed', false);

    return this.$config.axios
      .get(
        `${this.$config.apiBasePath}item/${id}`,
        { cancelToken },
      )
      .then(({ data: responseItem }) => {
        const isItemFormDisplayed = rootGetters['sidebar/sidebarMode'] === 'item' 
          || !rootGetters['settings/isItemFormInSidebar'];

        if (isItemFormDisplayed) {
          if (fullCachedItem) {
            if (rootGetters['lists/isOwnerView']) {
              const isLocalItemEqualToServerItem = Object.keys(fullCachedItem).every(
                key => {
                  return fullCachedItem[key] instanceof Object
                    ? responseItem[key].every(
                      (e, i) => JSON.stringify(e) === JSON.stringify(fullCachedItem[key][i]),
                    )
                    : fullCachedItem[key] === responseItem[key];
                },
              );
    
              if (isLocalItemEqualToServerItem) {
                commit('setCurrentItemObj', responseItem);
                commit('setIsItemSavingAllowed', true);
    
                if (getters.isItemChanged) {
                  dispatch('_updateItemOnServer', {
                    item: getters.currentItemObj,
                    cancelToken: null,
                  });
                }
              } else {
                commit('setResponseItemObj', responseItem);
                commitFromRoot('setModalNameToShow', 'itemConflictModal');
              }
            } else {
              commit('setCurrentItemObj', responseItem);
            }
          } else {
            commit('setCurrentItemObj', responseItem);
          }
        }

        commit('saveItemInCache', responseItem);

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

  _saveItemOnServer({ commit, dispatch, getters }, item) {
    const { details } = item;
    let { title } = item;

    if (!title && details) {
      title = generateTitleFromDetails(details);

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
        commit('saveItemInCache', responseItem);

        if (getters.currentItemObj) {
          commit('setCurrentItemObj', responseItem);
        }
      })
      .catch(error => {
        notifyAboutError(error);
        dispatchFromRoot('lists/_fetchListById', { id: listId, cancelToken: null });
      });
  },

  _updateItemOnServer({ getters, commit, dispatch }, { item, cancelToken }) {
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
        commit('saveItemInCache', responseItem);
      })
      .catch(error => {
        if (!cancelToken) {
          notifyAboutError(error);
          dispatch('_fetchItemById', { id: item.id, cancelToken: null });
        }
      });
  },

  _deleteItemOnServer({ commit }, { itemId, listId }) {
    commitFromRoot('deleteItem', itemId);
    commit('removeItemFromCache', itemId);
    
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
