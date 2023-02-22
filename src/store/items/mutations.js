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
};
