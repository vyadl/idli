import lsManager from '@/services/localStorageManager';

export default {
  _setItemInLocalStorage({ commit }, { name, value }) {
    const changedValues = lsManager.setItem({ name, value });

    if (changedValues) {
      commit('setListsLog', changedValues.listsLog);
      commit('setItemsCache', changedValues.itemsCache);
    }
  },

  _setItemsCacheFromLocalStorage({ commit }) {
    const cache = lsManager.getItem('itemsCache');

    if (cache) {
      commit('setItemsCache', JSON.parse(cache));
    }
  },

  _setListsLogFromLocalStorage({ commit }) {
    const listsLog = lsManager.getItem('listsLog');

    if (listsLog) {
      commit('setListsLog', JSON.parse(listsLog));
    }
  },

  _saveItemsFromListInCache({ getters, commit, dispatch }, { id, items }) {
    if (items.length) {
      commit('saveItemsFromListInCache', items);
      commit('addListLoListsLog', id);

      dispatch('_setItemInLocalStorage', { name: 'itemsCache', value: getters.cache });
      dispatch('_setItemInLocalStorage', { name: 'listsLog', value: getters.listsLog });
    }
  },

  _saveItemInCache({ getters, commit, dispatch }, item) {
    commit('saveItemInCache', item);
    dispatch('_setItemInLocalStorage', { name: 'itemsCache', value: getters.cache });
  },

  _removeItemFromCache({ getters, commit, dispatch }, itemId) {
    commit('removeItemFromCache', itemId);
    dispatch('_setItemInLocalStorage', { name: 'itemsCache', value: getters.cache });
  },

  _resetItemsCache({ commit }) {
    commit('resetItemsCache');
    lsManager.removeItem('itemsCache');
    lsManager.removeItem('listsLog');
  },
};
