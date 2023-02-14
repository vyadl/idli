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

  setPartialCache(state, items) {
    items.forEach(item => {
      state.partialCache[item.id] = item;
    });
  },

  removeCacheByListId(state, listId) {
    const itemsToDelete = Object.keys(state.partialCache).map(
      itemId => state.partialCache[itemId].listId === listId,
    );

    itemsToDelete.forEach(item => {
      delete state.cache[item.id];
      delete state.partialCache[item.id];
    });
  },

  saveItemInCache(state, item) {
    state.cache[item.id] = item;
    state.partialCache[item.id] = item;
  },

  removeItemFromCache(state, itemId) {
    delete state.cache[itemId];
    delete state.partialCache[itemId];
  },

  resetItemsCache(state) {
    state.cache = {};
    state.partialCache = {};
  },
};
