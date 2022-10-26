export default {
  setCurrentItemObj(state, item) {
    state.currentItemObj = item;
  },

  setEdittingItemIndex(state, index) {
    state.edittingItemIndex = index;
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
};
