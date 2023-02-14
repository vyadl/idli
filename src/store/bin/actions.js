import { notifyAboutError, commitFromRoot, dispatchFromRoot } from '@/store/utils'; // eslint-disable-line import/no-cycle

export default {
  async _fetchDeletedLists({ commit }) {
    const { data: deletedLists } = await this.$config.axios.get(
      `${this.$config.apiBasePath}lists/deleted`,
    );

    commit('setDeletedLists', deletedLists);
  },

  async _fetchDeletedItems({ commit }) {
    const { data: deletedItems } = await this.$config.axios.get(
      `${this.$config.apiBasePath}items/deleted`,
    );

    commit('setDeletedItems', deletedItems);
  },

  _fetchBin({ dispatch }) {
    commitFromRoot('increaseExplicitRequestsNumber');

    return Promise
      .all([
        dispatch('_fetchDeletedLists'),
        dispatch('_fetchDeletedItems'),
      ])
      .finally(() => {
        commitFromRoot('decreaseExplicitRequestsNumber');
      });
  },

  _restoreList({ commit, dispatch, rootGetters }, listId) {
    commitFromRoot('increaseExplicitRequestsNumber');
    commit('removeListFromBin', listId);

    this.$config.axios
      .patch(`${this.$config.apiBasePath}list/restore/${listId}`)
      .catch(error => {
        notifyAboutError(error);
      })
      .finally(async () => {
        commitFromRoot('decreaseExplicitRequestsNumber');
        await dispatch('_fetchingAfterBinActions', false);

        if (rootGetters['lists/lists'].length && rootGetters['lists/currentListId']) {
          dispatchFromRoot('lists/_fetchCurrentListItems');
        }
      });
  },

  _restoreItem({ commit, dispatch }, { listId, itemId }) {
    commitFromRoot('increaseExplicitRequestsNumber');
    commit('removeItemFromBin', itemId);

    this.$config.axios
      .patch(`${this.$config.apiBasePath}item/restore/${listId}/${itemId}`)
      .catch(error => {
        notifyAboutError(error);
      })
      .finally(() => {
        commitFromRoot('decreaseExplicitRequestsNumber');
        dispatch('_fetchingAfterBinActions', true);
      });
  },

  _hardDeleteList({ dispatch, commit }, listId) {
    commit('removeListFromBin', listId);

    this.$config.axios
      .delete(`${this.$config.apiBasePath}list/hard-delete/${listId}`)
      .catch(error => {
        notifyAboutError(error);
      })
      .finally(() => {
        dispatch('_fetchDeletedLists');
      });
  },

  _hardDeleteItem({ dispatch, commit }, { listId, itemId }) {
    commit('removeItemFromBin', itemId);

    this.$config.axios
      .delete(`${this.$config.apiBasePath}item/hard-delete/${listId}/${itemId}`)
      .catch(error => {
        notifyAboutError(error);
      })
      .finally(() => {
        dispatch('_fetchDeletedItems');
      });
  },

  _hardDeleteAllItems({ commit, dispatch }) {
    commit('removeBulkFromBin', 'items');

    this.$config.axios
      .delete(`${this.$config.apiBasePath}item/hard-delete-all`)
      .catch(error => {
        notifyAboutError(error);
      })
      .finally(() => {
        dispatch('_fetchDeletedItems');
      });
  },

  _restoreAllItems({ commit, dispatch }) {
    commitFromRoot('increaseExplicitRequestsNumber');
    commit('removeBulkFromBin', 'items');

    this.$config.axios
      .patch(`${this.$config.apiBasePath}item/restore-all`)
      .catch(error => {
        notifyAboutError(error);
      })
      .finally(() => {
        commitFromRoot('decreaseExplicitRequestsNumber');
        dispatch('_fetchingAfterBinActions', true);
      });
  },

  _hardDeleteAllLists({ commit, dispatch }) {
    commit('removeBulkFromBin', 'lists');

    this.$config.axios
      .delete(`${this.$config.apiBasePath}list/hard-delete-all`)
      .catch(error => {
        notifyAboutError(error);
      })
      .finally(() => {
        dispatch('_fetchDeletedLists');
      });
  },

  _restoreAllLists({ commit, dispatch, getters }) {
    commitFromRoot('increaseExplicitRequestsNumber');
    commit('removeBulkFromBin', 'lists');

    this.$config.axios
      .patch(`${this.$config.apiBasePath}list/restore-all`)
      .catch(error => {
        notifyAboutError(error);
      })
      .finally(async () => {
        commitFromRoot('decreaseExplicitRequestsNumber');
        await dispatch('_fetchingAfterBinActions', false);

        if (getters.currentListObj) {
          dispatchFromRoot('lists/_fetchCurrentListItems');
        }
      });
  },

  _fetchingAfterBinActions({ dispatch }, isItem) {
    if (isItem) {
      dispatchFromRoot('lists/_fetchCurrentListItems');
      dispatch('_fetchDeletedItems');
    } else {
      dispatchFromRoot('lists/_fetchListsForUser');
      dispatch('_fetchDeletedLists');
    }
  },
};
