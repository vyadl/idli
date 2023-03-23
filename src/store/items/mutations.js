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

  updateCurrentItemFieldsAfterServerResponse(state, { fieldsToUpdate, responseItem }) {
    fieldsToUpdate.forEach(field => {
      state.currentItemObj[field] = responseItem[field];
    });
  },

  setIsItemSavingAllowed(state, value) {
    state.isItemSavingAllowed = value;
  },

  increaseBackgroundRequestsNumber(state) {
    state.backgroundRequestsNumber++;
  },

  decreaseBackgroundRequestsNumber(state) {
    state.backgroundRequestsNumber--;
  },
};
