// eslint-disable-next-line import/no-cycle
import {
  notifyAboutError,
  commitFromRoot,
  dispatchFromRoot,
  generateTitleFromDetails,
} from '@/store/utils';
import { Item } from '@/models/models'; // eslint-disable-line import/no-cycle

export default {
  _fetchItemById({ commit }, { id, cancelToken }) {
    commitFromRoot('increaseExplicitRequestsNumber');

    return this.$config.axios
      .get(
        `${this.$config.apiBasePath}item/${id}`,
        { cancelToken },
      )
      .then(({ data }) => {
        commit('setCurrentItemObj', data);
        
        return data;
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

    if (rootGetters['lists/currentListId']) {
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

  _addNewItemPlaceholder({ dispatch, rootGetters }) {
    const newItem = new Item();
    const itemWithTemporaryId = {
      ...newItem,
      temporaryId: Date.now(),
      listId: rootGetters['lists/currentListId'],
    };

    commitFromRoot('addItem', itemWithTemporaryId);
    dispatch('_findAndSetEdittingItemIndex', itemWithTemporaryId);
  },

  _saveItemOnServer({ dispatch, getters }) {
    dispatch(
      getters.edittingItemObj.temporaryId
        ? '_addItemOnServer'
        : '_updateItemOnServer',
      { item: getters.edittingItemObj, cancelToken: null },
    );
  },

  _addItemOnServer({ rootGetters, commit, dispatch }, { item, cancelToken }) {
    const listId = rootGetters['lists/currentListObj'].id;
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
        commitFromRoot('updateItemByTemporaryId', responseItem);
        commit('setCurrentItemObj', responseItem);
      })
      .catch(error => {
        notifyAboutError(error);
        dispatch('_fetchListById', { id: listId, cancelToken: null });
      });
  },

  _updateItemOnServer({ dispatch }, { item, cancelToken }) {
    let { title } = item;
    const { details } = item;

    if (!title && details) {
      title = generateTitleFromDetails(item.details);
    }

    this.$config.axios
      .patch(
        `${this.$config.apiBasePath}item/update/${item.listId}/${item.id}`,
        {
          title,
          details,
          tags: item.tags,
          category: item.category,
          relatedLists: item.relatedLists,
          relatedItems: item.relatedItems,
        },
        { cancelToken },
      )
      .then(({ data: responseList }) => {
        commitFromRoot('updateItemFieldsByServerResponse', responseList);
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
