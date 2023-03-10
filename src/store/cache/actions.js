import lsManager from '@/services/localStorageManager';

export default {
  _setItemInLocalStorage({ commit }, { key, value }) {
    const changedValues = lsManager.setItemAndReturnUpdatedValues({ key, value });

    if (changedValues) {
      commit('setListsLog', changedValues.listsLog);
      commit('setItemsCache', changedValues.itemsCache);
    }
  },

  _setItemsCacheFromLocalStorage({ commit }) {
    const cache = lsManager.getItem('itemsCache');

    if (cache) {
      commit('setItemsCache', cache);
    }
  },

  _setListsLogFromLocalStorage({ commit }) {
    const listsLog = lsManager.getItem('listsLog');

    if (listsLog) {
      commit('setListsLog', listsLog);
    }
  },

  _saveItemsFromListInCache({ getters, commit, dispatch }, { id, items }) {
    if (items.length) {
      commit('saveItemsFromListInCache', items);
      commit('addListLoListsLog', id);

      dispatch('_setItemInLocalStorage', { key: 'itemsCache', value: getters.cache });
      dispatch('_setItemInLocalStorage', { key: 'listsLog', value: getters.listsLog });
    }
  },

  _saveItemInCache({ getters, commit, dispatch }, item) {
    commit('saveItemInCache', item);
    dispatch('_setItemInLocalStorage', { key: 'itemsCache', value: getters.cache });
  },

  _removeItemFromCache({ getters, commit, dispatch }, itemId) {
    commit('removeItemFromCache', itemId);
    dispatch('_setItemInLocalStorage', { key: 'itemsCache', value: getters.cache });
  },

  _resetItemsCache({ commit }) {
    commit('resetItemsCache');
    lsManager.removeItem('itemsCache');
    lsManager.removeItem('listsLog');
  },
};
