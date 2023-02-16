export default {
  setCurrentItemObj(state, value) {
    state.currentItemObj = value;
  },

  setResponseItemObj(state, value) {
    state.responseItemObj = value;
  },

  updateItemFieldLocally(state, { field, value }) {
    state.currentItemObj[field] = value;
  },

  setIsItemSavingAllowed(state, value) {
    state.isItemSavingAllowed = value;
  },

  removeCacheByListId(state, listId) {
    const itemsToDelete = Object.keys(state.cache).map(
      itemId => state.cache[itemId].listId === listId,
    );

    itemsToDelete.forEach(item => {
      delete state.cache[item.id];
    });
  },

  saveManyItemsInCache(state, items) {
    items.forEach(item => {
      state.cache[item.id] = item;
    });
  },

  saveItemInCache(state, item) {
    state.cache[item.id] = item;
  },

  removeItemFromCache(state, itemId) {
    delete state.cache[itemId];
  },

  resetItemsCache(state) {
    state.cache = {};
  },
};
