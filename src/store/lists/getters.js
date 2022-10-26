export default {
  lists: state => state.lists,
  testLists: state => state.testLists,
  currentListId: state => state.currentListId,
  currentListObj: state => state.currentListObj,
  edittingListObj: state => state.edittingListObj,
  currentListTags: (state, getters) => getters.currentListObj?.tags,
  currentListCategories: (state, getters) => getters.currentListObj?.categories,
  isUserOwnsCurrentList: state => state.lists.some(
    list => list.id === state.currentListId,
  ),
  isPublicView: state => state.currentListView === 'public',
  isOwnerView: (state, getters) => getters.isUserOwnsCurrentList && !getters.isPublicView,
};
