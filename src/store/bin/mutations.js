export default {
  removeListFromBin(state, id) {
    state.deletedLists = state.deletedLists.filter(list => list.id !== id);
  },

  removeItemFromBin(state, id) {
    state.deletedItems = state.deletedItems.filter(item => item.id !== id);
  },

  removeBulkFromBin(state, unit) {
    if (unit === 'lists') {
      state.deletedLists = [];
    } else if (unit === 'items') {
      state.deletedItems = [];
    }
  },

  setDeletedLists(state, lists) {
    state.deletedLists = lists;
  },

  setDeletedItems(state, items) {
    state.deletedItems = items;
  },
};
