// eslint-disable-next-line import/no-cycle
import {
  notifyAboutError,
  commitFromRoot,
  dispatchFromRoot,
  generateTitleFromDetails,
} from '@/store/utils';
import { addQueryItems } from '@/router/utils';
import { Item } from '@/models/models'; // eslint-disable-line import/no-cycle

export default {
  _fetchItemById({ commit, rootGetters }, { id, cancelToken }) {
    addQueryItems({ item: id });

    const localItem = rootGetters.currentListItems.find(item => item.id === id);

    if (localItem) {
      commit('setCurrentItemObj', localItem);
    }

    commitFromRoot('increaseExplicitRequestsNumber');

    return this.$config.axios
      .get(
        `${this.$config.apiBasePath}item/${id}`,
        { cancelToken },
      )
      .then(({ data: responseItem }) => {
        commit('setCurrentItemObj', responseItem);
        commitFromRoot('updateItemInCurrentListItems', JSON.parse(JSON.stringify(responseItem)));

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

  _findAndSetEdittingItemIndex({ commit, rootGetters }, targetItem) {
    let itemIndex = null;

    function compareItemsById(item1, item2) {
      return item1.temporaryId
        ? item1.temporaryId === item2.temporaryId
        : item1.id === item2.id;
    }

    if (rootGetters.currentListItems[0] instanceof Object) {
      itemIndex = rootGetters.currentListItems
        .findIndex(item => compareItemsById(item, targetItem));
    } else {
      const { listId } = targetItem;
      const listIndex = rootGetters['lists/lists'].findIndex(list => list.id === listId);

      itemIndex = rootGetters['lists/lists'][listIndex].items
        .findIndex(item => compareItemsById(item, targetItem));
    }

    commit('setEdittingItemIndex', itemIndex);
  },

  _addNewItemPlaceholder({ commit, dispatch, rootGetters }) {
    const unsavedItem = rootGetters.currentListItems.find(item => item.temporaryId);

    if (!unsavedItem) {
      const newItem = new Item();
      const itemWithTemporaryId = {
        ...newItem,
        temporaryId: Date.now(),
        listId: rootGetters['lists/currentListId'],
      };

      commit('resetRelatedUnitsLocally');
      commitFromRoot('addItem', itemWithTemporaryId);
      dispatch('_findAndSetEdittingItemIndex', itemWithTemporaryId);
    }

    rootGetters['settings/isItemFormInSidebar']
      ? dispatchFromRoot('sidebar/_openSidebar', 'item')
      : commitFromRoot('setModalNameToShow', 'itemModal');
  },

  _saveItemOnServer({ dispatch, getters }, item) {
    const { details } = item;
    let { title } = item;

    if (!title && details) {
      title = generateTitleFromDetails(details);

      if (getters.edittingItemObj) {
        commitFromRoot('updateItemFieldLocally', {
          field: 'title',
          value: title,
        });
      }
    }

    dispatch(item.temporaryId
      ? '_addItemOnServer'
      : '_updateItemOnServer', {
      item: {
        ...item,
        title,
      },
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
        }, 
        { cancelToken },
      )
      .then(({ data: responseItem }) => {
        commitFromRoot('updateItemByTemporaryId', responseItem);

        if (getters.edittingItemObj) {
          commit('setCurrentItemObj', responseItem);
        }
      })
      .catch(error => {
        notifyAboutError(error);
        dispatchFromRoot('lists/_fetchListById', { id: listId, cancelToken: null });
      });
  },

  _updateItemOnServer({ dispatch }, { item, cancelToken }) {
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
        },
        { cancelToken },
      )
      .then(({ data: responseItem }) => {
        commitFromRoot('updateItemFieldsByServerResponse', responseItem);
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
