export default {
  setItemsCache(state, cache) {
    state.cache = cache;
  },
  
  removeCacheByListId(state, listId) {
    const itemsIdsToDelete = Object.keys(state.cache).filter(
      itemId => state.cache[itemId].listId === listId,
    );

    itemsIdsToDelete.forEach(itemId => {
      delete state.cache[itemId];
    });
  },

  saveItemsFromListInCache(state, items) {
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

  // lists log

  setListsLog(state, listsLog) {
    state.listsLog = listsLog;
  },

  addListLoListsLog(state, listId) {
    state.listsLog[listId] = Date.now();
  },

  removeListFromListsLog(state, listId) {
    delete state.listsLog[listId];
  },
};
