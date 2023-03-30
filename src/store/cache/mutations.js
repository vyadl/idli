export default {
  setItemsCache(state, itemsCache) {
    state.itemsCache = itemsCache;
  },

  saveItemsFromListInCache(state, items) {
    items.forEach(item => {
      state.itemsCache[item.id] = item;
    });
  },

  saveItemInCache(state, item) {
    state.itemsCache[item.id] = item;
  },

  removeItemFromCache(state, itemId) {
    delete state.itemsCache[itemId];
  },
  
  setListsCache(state, listsCache) {
    state.listsCache = listsCache;
  },

  rewriteListInCache(state, list) {
    state.listsCache[list.id] = list;
  },

  updateListFieldsInCache(state, list) {
    Object.keys(list).forEach(key => {
      state.listsCache[list.id][key] = list[key];
    });
  },

  addTimeStampToList(state, listId) {
    state.listsCache[listId].timeStamp = Date.now();
  },

  addItemIdToListInCache(state, { listId, itemId }) {
    if (state.listsCache[listId].items) {
      state.listsCache[listId].items.push(itemId);
    } else {
      state.listsCache[listId].items = [itemId];
    }
  },

  removeItemIdFromListInCache(state, { listId, itemId }) {
    state.listsCache[listId].items.filter(item => item.id !== itemId);
  },

  removeListFromCache(state, listId) {
    const itemsIdsToDelete = Object.keys(state.itemsCache).filter(
      itemId => state.itemsCache[itemId].listId === listId,
    );

    itemsIdsToDelete.forEach(itemId => {
      delete state.itemsCache[itemId];
    });

    delete state.listsCache[listId];
  },

  resetCache(state) {
    state.itemsCache = {};
    state.listsCache = {};
  },
};
