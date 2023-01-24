export default {
  setNotification(state, { text, time }) {
    state.notification = {
      text,
      time: time || null,
    };
  },

  setModalNameToShow(state, name) {
    state.modalNameToShow = name;
  },

  setConfirmationModalTitle(state, title) {
    state.confirmationModalTitle = title;
  },

  setCurrentRouteName(state, name) {
    state.currentRouteName = name;
  },

  increaseExplicitRequestsNumber(state) {
    state.explicitRequestsNumber++;
  },

  decreaseExplicitRequestsNumber(state) {
    state.explicitRequestsNumber--;
  },

  // items

  setIsDraggableMode(state, value) {
    state.isDraggableMode = value;
  },

  setCurrentListItems(state, items) {
    state.currentListItems = items;
  },

  updateItemInCurrentListItems(state, item) {
    const index = state.currentListItems.findIndex(localItem => localItem.id === item.id);

    state.currentListItems.splice(index, 1, item);
  },

  addItem(state, item) {
    state.currentListItems.push(item);
  },

  updateItemFieldLocally(state, { field, value }) {
    state.currentListItems[state.items.edittingItemIndex][field] = value;
  },

  updateItemFieldsByServerResponse(state, item) {
    const targetIndex = state.currentListItems
      .findIndex(localItem => localItem.id === item.id);
    const targetItem = state.currentListItems[targetIndex];
    const fieldsToUpdate = ['updatedAt', 'title'];

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

  // search
  
  setSearchResults(state, results) {
    state.searchResults = results;
  },
};
