export default {
  setLists(state, lists) {
    state.lists = lists;
  },

  setTestLists(state, lists) {
    state.testLists = lists;
  },

  setCurrentListId(state, id) {
    state.currentListId = id;
  },

  setCurrentListObj(state, list) {
    state.currentListObj = list;
  },

  setCurrentListView(state, view) {
    state.currentListView = view;
  },

  setCurrentListItems(state, items) {
    state.currentListItems = items;
  },

  addList(state, list) {
    state.lists.push(list);
  },

  setListForEditting(state, list) {
    state.edittingListObj = list;
  },

  updateList(state, list) {
    const index = state.lists.findIndex(localList => localList.id === list.id);

    state.lists.splice(index, 1, list);
  },
  
  deleteList(state, id) {
    state.lists = state.lists.filter(list => list.id !== id);
  },

  addItemsFromTestList(state, items) {
    state.lists.find(list => list.id === state.currentListId).items = items;
  },

  // items

  addItem(state, item) {
    state.currentListItems.push(item);
  },

  setEdittingItemIndex(state, index) {
    state.edittingItemIndex = index;
  },

  setCurrentItemObj(state, item) {
    state.currentItemObj = item;
  },

  updateRelatedUnitsLocally(state, { field, value }) {
    state.currentItemObj[field] = value;
  },

  resetRelatedUnitsLocally(state) {
    if (state.currentItemObj) {
      state.currentItemObj.relatedItems = null;
      state.currentItemObj.relatedLists = null;
      state.currentItemObj.referringItems = null;
    }
  },

  updateItemFieldLocally(state, { field, value }) {
    state.currentListItems[state.edittingItemIndex][field] = value;
  },

  updateItem(state, item) {
    const index = state.currentListItems.findIndex(localItem => localItem.id === item.id);

    state.currentListItems.splice(index, 1, item);
  },

  updateItemFieldsByServerResponse(state, item) {
    const targetIndex = state.currentListItems
      .findIndex(localItem => localItem.id === item.id);
    const targetItem = state.currentListItems[targetIndex];
    const fieldsToUpdate = ['updatedAt'];

    fieldsToUpdate.forEach(field => {
      targetItem[field] = item[field];
    });
  },

  updateItemByTemporaryId(state, { temporaryId, ...item }) {
    const index = state.currentListItems.findIndex(
      localItem => localItem.temporaryId === temporaryId,
    );
    
    state.currentListItems.splice(index, 1, item);
  },

  deleteItem(state, id) {
    state.currentListItems = state.currentListItems.filter(item => item.id !== id);
  },

  deleteItemByTemporaryId(state, temporaryId) {
    state.currentListItems = state.currentListItems
      .filter(item => item.temporaryId !== temporaryId);
  },
};
