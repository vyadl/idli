export default {
  currentItemObj: state => state.currentItemObj,
  edittingItemIndex: state => state.edittingItemIndex,
  edittingItemObj: (state, getters, rootState, rootGetters) => {
    return rootGetters.currentListItems[state.edittingItemIndex];
  },
  currentItemTags: (state, getters, rootState, rootGetters) => {
    return rootGetters['lists/currentListTags'].filter(
      listTag => getters.edittingItemObj.tags.includes(listTag.id),
    );
  },
};
