export default {
  currentItemObj: state => state.currentItemObj,
  edittingItemIndex: state => state.edittingItemIndex,
  edittingItemObj: (state, getters, rootState, rootGetters) => {
    return rootGetters.currentListItems[state.edittingItemIndex];
  },
};
