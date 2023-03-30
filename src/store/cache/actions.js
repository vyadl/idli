/* eslint-disable no-param-reassign */
import lsManager from '@/services/localStorageManager';

export default {
  _setItemInLocalStorage({ commit }, { key, value }) {
    const changedValues = lsManager.setItemAndReturnUpdatedValues({ key, value });

    if (changedValues) {
      commit('setListsCache', changedValues.listsCache);
      commit('setItemsCache', changedValues.itemsCache);
    }
  },

  _setListsAndItemsCacheFromLocalStorage({ commit }) {
    const itemsCache = lsManager.getItem('itemsCache');
    const listsCache = lsManager.getItem('listsCache');

    if (itemsCache) {
      commit('setItemsCache', itemsCache);
    }

    if (listsCache) {
      commit('setListsCache', listsCache);
    }
  },

  _saveItemsFromListInCache({ getters, commit, dispatch }, { id, items }) {
    if (items?.length) {
      commit('saveItemsFromListInCache', items);
      dispatch('_setItemInLocalStorage', { key: 'itemsCache', value: getters.itemsCache });

      items.forEach(item => {
        commit('addItemIdToListInCache', { listId: id, itemId: item.id });
      });

      dispatch('_updateListTimeStampAndLocalStorage', id);
    }
  },

  _saveItemInCache({ getters, commit, dispatch }, item) {
    commit('saveItemInCache', item);
    dispatch('_setItemInLocalStorage', { key: 'itemsCache', value: getters.itemsCache });

    commit('addItemIdToListInCache', { listId: item.listId, itemId: item.id });

    dispatch('_updateListTimeStampAndLocalStorage', item.listId);
  },

  _removeItemFromCache({ getters, commit, dispatch }, { itemId, listId }) {
    commit('removeItemFromCache', itemId);
    dispatch('_setItemInLocalStorage', { key: 'itemsCache', value: getters.itemsCache });

    commit('removeItemIdFromListInCache', { itemId, listId });

    dispatch('_updateListTimeStampAndLocalStorage', listId);
  },

  _updateListTimeStampAndLocalStorage({ getters, commit, dispatch }, id) {
    commit('addTimeStampToList', id);
    dispatch('_setItemInLocalStorage', { key: 'listsCache', value: getters.listsCache });
  },

  _saveAllListsInCache({ getters, commit, dispatch }, lists) {
    const cache = {};

    lists.forEach(list => {
      cache[list.id] = list;
    });

    commit('setListsCache', cache);
    dispatch('_setItemInLocalStorage', { key: 'listsCache', value: getters.listsCache });
  },

  _saveListInCache({ commit, dispatch }, { list, byField = false }) {
    const listCopy = JSON.parse(JSON.stringify(list));

    if (listCopy.items?.[0] instanceof Object) {
      listCopy.items = listCopy.items.map(item => item.id);
    }

    commit(
      byField
        ? 'updateListFieldsInCache'
        : 'rewriteListInCache',
      listCopy,
    );
    dispatch('_updateListTimeStampAndLocalStorage', listCopy.id);
  },

  _removeListFromCache({ getters, commit, dispatch }, listId) {
    commit('removeListFromCache', listId);
    dispatch('_setItemInLocalStorage', { key: 'listsCache', value: getters.listsCache });
  },

  _resetCache({ commit }) {
    commit('resetCache');
    lsManager.removeItem('listsCache');
    lsManager.removeItem('itemsCache');
  },
};
